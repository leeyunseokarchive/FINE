import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6rivTFb3qiZEwGXrSoxEr_t2CeyRqqpg",
  authDomain: "fine-3d67e.firebaseapp.com",
  projectId: "fine-3d67e",
  storageBucket: "fine-3d67e.firebasestorage.app",
  messagingSenderId: "153902197035",
  appId: "1:153902197035:web:11a2be2453174a4ea9bd6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
