import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Remplacez ces valeurs par celles de votre projet Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy"
};

// Ne pas initialiser si les clés ne sont pas configurées (pour éviter les crashs du MVP)
let app, auth, provider;

try {
  if (firebaseConfig.apiKey !== "dummy") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
  }
} catch (error) {
  console.error("Firebase Initialization Error", error);
}

export const signInWithGoogle = async () => {
  if (!auth) {
    console.warn("⚠️ Firebase n'est pas configuré. Simulation de connexion.");
    return { user: { displayName: 'Utilisateur Test' } };
  }
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("Erreur de connexion", error);
    throw error;
  }
};

export const logOut = async () => {
  if (!auth) return true;
  return signOut(auth);
};

export { auth };
