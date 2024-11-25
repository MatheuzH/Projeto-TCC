"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseconfig';
import { Bell, Calendar, Sun, Image, UserPlus, LogOut } from 'lucide-react'; // Importar novo ícone
import HomeButton from './components/HomeButton';
import './Home.css';

export default function Home() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login'); // Redireciona para a página de login se o usuário não estiver autenticado
      } else {
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redireciona para a página de login após o logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout. Tente novamente.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Agenda Família</h1>
      <p className="description">
        Acompanhe as atividades, compromissos e novidades diárias de forma fácil e prática.
      </p>
      <div className="buttonContainer">
        <HomeButton href="/avisos" icon={Bell} label="Avisos" />
        <HomeButton href="/calendario" icon={Calendar} label="Calendário" />
        <HomeButton href="/diaadia" icon={Sun} label="Dia a Dia" />
        <HomeButton href="/galeria" icon={Image} label="Galeria" />
        {isAdmin && ( // Verifica se o usuário é admin
          <HomeButton href="/cadastro" icon={UserPlus} label="Cadastrar Usuários" />
        )}
      </div>
      <div className="logoutButtonContainer">
        <button className="logoutButton" onClick={handleLogout}>
          <LogOut size={24} className="iconStyle" />
          Logout
        </button>
      </div>
    </div>
  );
}
