"use client";
import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react'; // Ícone de Home
import "./cadastro.css";

export default function Cadastro() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privilegio, setPrivilegio] = useState('responsável'); // Padrão agora é "responsavel"
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filhos, setFilhos] = useState([]); // Lista de filhos

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      router.push("/");
    }
  }, [router]);

  const handleAddFilho = () => {
    setFilhos([...filhos, { nome: '', turma: '' }]);
  };

  const handleChangeFilho = (index, field, value) => {
    const newFilhos = [...filhos];
    newFilhos[index][field] = value;
    setFilhos(newFilhos);
  };

  const handleRemoveFilho = (index) => {
    const newFilhos = [...filhos];
    newFilhos.splice(index, 1);
    setFilhos(newFilhos);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, "Users", newUser.uid), {
        email: email,
        privilegio: privilegio,
        filhos: privilegio === 'responsável' ? filhos : [],
      });

      setEmail('');
      setPassword('');
      setPrivilegio('responsável');
      setFilhos([]);
      alert(`Usuário cadastrado com sucesso como ${privilegio}!`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/'); // Redireciona para a Home Page
  };

  return (
    <div className="background-container">
      <div className="App">
        <div className="icon-home" onClick={handleBackToHome}>
          <Home size={32} />
        </div>
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
          <option value="responsável">Responsável</option>
          <option value="admin">Administrador</option>
        </select>

        {privilegio === "responsável" && (
          <div className="filhos-section">
            <h3>Filhos</h3>
            {filhos.map((filho, index) => (
              <div key={index} className="filho-entry">
                <input
                  type="text"
                  placeholder="Nome do Filho"
                  value={filho.nome}
                  onChange={(e) => handleChangeFilho(index, 'nome', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Turma"
                  value={filho.turma}
                  onChange={(e) => handleChangeFilho(index, 'turma', e.target.value)}
                />
                <button onClick={() => handleRemoveFilho(index)}>Remover</button>
              </div>
            ))}
            <button onClick={handleAddFilho}>Adicionar Filho</button>
          </div>
        )}
        <br />
        <button onClick={handleSignUp} disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Usuário"}
        </button>
      </div>
    </div>
  );
}
