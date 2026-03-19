import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId:             import.meta.env.VITE_FIREBASE_APPID,
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  
  // The "Real Life" API requires a token to verify the user on your server
  const token = await result.user.getIdToken();
  
  return {
    token,
    user: {
      name:  result.user.displayName,
      email: result.user.email,    // FIXED: Was result.user.photoURL
      photo: result.user.photoURL,
      uid:   result.user.uid,
    },
  };
};

export const firebaseSignOut = () => signOut(auth);
export { auth };
export default app;