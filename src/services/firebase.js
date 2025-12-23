import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- FIREBASE CONFIGURATION ---
let firebaseConfig = {};
try {
    // Reading from the global variable or fallback to empty object if not defined
    firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
} catch (e) {
    console.warn("Could not parse firebase config", e);
}

// Fallback for development if no config is present to prevent whitespace screen crash
const isConfigEmpty = Object.keys(firebaseConfig).length === 0;
if (isConfigEmpty) {
    console.warn("Firebase config is missing. Initializing with dummy config for UI development purposes.");
    firebaseConfig = {
        apiKey: "dummy-api-key",
        authDomain: "dummy.firebaseapp.com",
        projectId: "dummy-project"
    };
}

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

// Flag to disable DB features. 
// Automatically true if config is missing, or can be forced to true for offline dev.
export const DISABLE_DB = isConfigEmpty;

export { app, auth, db };
