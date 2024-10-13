import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCuG8T13PcNGmHH6ayiWLjH17A4K9BILpg",
  authDomain: "video-grid-bf9ed.firebaseapp.com",
  projectId: "video-grid-bf9ed",
  storageBucket: "video-grid-bf9ed.appspot.com",
  messagingSenderId: "601057401616",
  appId: "1:601057401616:web:856f2486b6417d2f7da395"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);