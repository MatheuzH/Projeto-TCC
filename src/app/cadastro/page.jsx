"use client";
import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import "./cadastro.css";

export default function Cadastro() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privilegio, setPrivilegio] = useState('pai'); // Padrão é "pai"
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verifica se o usuário atual é admin antes de permitir acesso à página
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      // Redireciona para a página inicial se o usuário não for admin
      router.push("/");
    }
  }, [router]);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      // Cria o usuário com e-mail e senha no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Salva o privilégio do novo usuário no Firestore
      await setDoc(doc(db, "Users", newUser.uid), {
        email: email,
        privilegio: privilegio, // Pode ser "admin" ou "pai"
      });

      setEmail('');
      setPassword('');
      setPrivilegio('pai');
      alert(`Usuário cadastrado com sucesso como ${privilegio}!`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Cadastrar Novo Usuário</h1>
      {error && <p className="error">Erro: {error}</p>}
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
      <select
        value={privilegio}
        onChange={(e) => setPrivilegio(e.target.value)}
      >
        <option value="pai">Pai</option>
        <option value="admin">Administrador</option>
      </select>
      <button onClick={handleSignUp} disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar Usuário"}
      </button>
    </div>
  );
}
