"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseconfig';
import { Bell, Calendar, Sun, Image } from 'lucide-react';
import HomeButton from './components/HomeButton';
import './Home.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login'); // Redireciona para a página de login se o usuário não estiver autenticado
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="container">
      <h1 className="title">Agenda de Creche</h1>
      <p className="description">
        Acompanhe as atividades, compromissos e novidades diárias de forma fácil e prática.
      </p>
      <div className="buttonContainer">
        <HomeButton href="/avisos" icon={Bell} label="Avisos" />
        <HomeButton href="/calendario" icon={Calendar} label="Calendário" />
        <HomeButton href="/diaadia" icon={Sun} label="Dia a Dia" />
        <HomeButton href="/imagens" icon={Image} label="Imagens" />
      </div>
    </div>
  );
}
