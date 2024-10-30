import { collection, addDoc } from "firebase/firestore"; 
import { db } from "./firebaseconfig";

export async function addAviso(titulo, descricao) {
  try {
    const docRef = await addDoc(collection(db, "avisos"), {
      titulo: titulo,
      descricao: descricao,
      timestamp: new Date()
    });
    console.log("Documento adicionado com ID: ", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar documento: ", e);
  }
}

export async function fetchAvisos() {
    const querySnapshot = await getDocs(collection(db, "avisos"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().titulo}`);
    });
  }
