"use client";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import "./login.css";
import Link from 'next/link.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        // Acessa o documento do usuário usando o UID correto na coleção "Users"
        const userRef = doc(db, "Users", user.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const isAdmin = userData.privilegio === "admin";

          // Salva o status de administrador no localStorage
          localStorage.setItem("isAdmin", isAdmin ? "true" : "false");

          // Redireciona com base no privilégio
          if (isAdmin) {
            window.location.href = "/";
          } else {
            window.location.href = "/";
          }
        } else {
          // Se o documento não existir, crie um documento padrão
          await setDoc(userRef, {
            email: user.user.email,
            privilegio: "pai", // Define o privilégio padrão como "pai"
          });

          console.log("Documento criado para o usuário com privilégio padrão 'pai'.");
          localStorage.setItem("isAdmin", "false");
          window.location.href = "/";
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <h1>Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button onClick={() => signInWithEmailAndPassword(email, password)}>
        Login
      </button>
    </div>
  );
}
