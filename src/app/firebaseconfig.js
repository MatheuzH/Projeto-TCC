import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAWc6XoxKt90n2-evMaVs8gUP0Q8Upei2U",
  authDomain: "projeto-tcc-80a35.firebaseapp.com",
  projectId: "projeto-tcc-80a35",
  storageBucket: "projeto-tcc-80a35.appspot.com",
  messagingSenderId: "780441098752",
  appId: "1:780441098752:web:c90d9ac71b2ebc93ca16e5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth};
