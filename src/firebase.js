import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBw-_fwaUlApkkJmd0AF37DtrJevy_iy0M",
  authDomain: "lost-found-e748c.firebaseapp.com",
  projectId: "lost-found-e748c",
  storageBucket: "lost-found-e748c.firebasestorage.app",
  messagingSenderId: "900386126205",
  appId: "1:900386126205:web:0d03eff896ea044a953414",
  measurementId: "G-N2KYR3WR9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app; 