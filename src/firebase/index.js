// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/* const firebaseConfig = {
  apiKey: "AIzaSyAeUa_AcKZ1v338oEb03HWWc1BiIapyvFU",
  authDomain: "truly-wallet-5cd8f.firebaseapp.com",
  projectId: "truly-wallet-5cd8f",
  storageBucket: "truly-wallet-5cd8f.appspot.com",
  messagingSenderId: "601602016352",
  appId: "1:601602016352:web:12d7bbed7b2ab150272f05",
  measurementId: "G-RBY8ZMX35G",
}; */

const firebaseConfig = {
  apiKey: "AIzaSyAVuXUnig0TQR4G2QTRdgMP_l5hcU7My_s",
  authDomain: "truly-wallet-001.firebaseapp.com",
  projectId: "truly-wallet-001",
  storageBucket: "truly-wallet-001.appspot.com",
  messagingSenderId: "394940639409",
  appId: "1:394940639409:web:ecf13826d6c95d840c5a90",
  measurementId: "G-CVQNS6JB2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
