import Link from 'next/link';
import "./home.css"

export default function Home() {
  return (
    <div className="container">
      <h1 className="title">Agenda Virtual - Creche</h1>
      <div className="cards">
        <Link href="/diaadia">
          <div className="card">
            <h2>Dia a Dia</h2>
          </div>
        </Link>
        <Link href="/avisos">
          <div className="card">
            <h2>Avisos</h2>
          </div>
        </Link>
        <Link href={"/imagens"}>
          <div className="card">
            <h2>Imagens</h2>
          </div>
        </Link>
        <Link href="/calendario">
          <div className="card">
            <h2>Calendário</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
