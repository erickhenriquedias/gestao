import { useState, useEffect } from 'react';
import { db, DISABLE_DB } from '../services/firebase';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    writeBatch,
    setDoc
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const useFirestore = (collectionName) => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync Data
    useEffect(() => {
        if (!user || DISABLE_DB) {
            setData([]);
            setLoading(false);
            return;
        }

        // Reference to user's specific sub-collection
        const collectionRef = collection(db, `users/${user.uid}/${collectionName}`);
        const q = query(collectionRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setData(items);
            setLoading(false);
        }, (error) => {
            console.error(`Error syncing ${collectionName}:`, error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, collectionName]);

    // Add Item
    const add = async (item) => {
        if (!user || DISABLE_DB) return;
        try {
            const collectionRef = collection(db, `users/${user.uid}/${collectionName}`);
            await addDoc(collectionRef, item);
        } catch (error) {
            console.error(`Error adding to ${collectionName}:`, error);
            throw error;
        }
    };

    // Delete Item
    const remove = async (id) => {
        if (!user || DISABLE_DB) return;
        try {
            const docRef = doc(db, `users/${user.uid}/${collectionName}`, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting from ${collectionName}:`, error);
            throw error;
        }
    };

    // Batch Upload (Migration)
    const syncLocalData = async (localItems) => {
        if (!user || !localItems.length || DISABLE_DB) return;

        const batch = writeBatch(db);
        const collectionRef = collection(db, `users/${user.uid}/${collectionName}`);

        localItems.forEach(item => {
            // Create a new doc reference for each item
            const newDocRef = doc(collectionRef);
            // Exclude 'id' if it exists in local item to avoid conflict, let Firestore gen it or use it as key?
            // Strategy: Use purely new IDs for simplicity, or re-use if critical.
            // For now, simple spread.
            const { id, ...itemData } = item;
            batch.set(newDocRef, itemData);
        });

        try {
            await batch.commit();
            console.log(`Synced ${localItems.length} items to ${collectionName}`);
        } catch (error) {
            console.error("Batch sync failed:", error);
        }
    };

    return { data, loading, add, remove, syncLocalData };
};
