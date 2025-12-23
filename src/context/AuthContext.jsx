import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, DISABLE_DB } from '../services/firebase';
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Login with Google
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Monitor Auth State
    useEffect(() => {
        if (DISABLE_DB) {
            console.log("AuthContext: Database disabled (Offline Mode). Using mock user.");
            setUser({
                uid: 'offline-dev-user',
                displayName: 'Dev Offline',
                email: 'dev@local',
                photoURL: null
            });
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            // Helpful log for debugging
            if (currentUser) {
                console.log("AuthContext: User logged in", currentUser.uid);
            } else {
                console.log("AuthContext: No user logged in");
            }
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
