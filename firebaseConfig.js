
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getAnalytics } from "firebase/analytics"; 


const firebaseConfig = {
  apiKey: "AIzaSyA66fmzez-atBqibpoWkURGUabf-K41d18", 
  authDomain: "web-admin-scraper.firebaseapp.com", 
  projectId: "web-admin-scraper", 
  storageBucket: "web-admin-scraper.appspot.com", 
  messagingSenderId: "993176094680", 
  appId: "1:993176094680:web:0a622ddda7d6ee78e794ad", 
  measurementId: "G-2SV38BR6CR" 
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 


export const auth = getAuth(app); 