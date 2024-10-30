import React from 'react';
import { Bell, Calendar, Sun, Image } from 'lucide-react';
import HomeButton from './components/HomeButton';
import './Home.css';

export default function Home() {
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
