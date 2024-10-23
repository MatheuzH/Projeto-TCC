"use client"
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import styles from './home.css'

export default function Home() {
  const [activePage, setActivePage] = useState(null)

  const handleNavigation = (page) => {
    setActivePage(page)
    // Aqui você pode adicionar lógica adicional de navegação se necessário
    console.log(`Navegando para a página: ${page}`)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Agenda da Creche</title>
        <meta name="description" content="Agenda para crianças de creches" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>Agenda da Creche</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <Link href="#" className={`${styles.button} ${styles.calendario}`} onClick={() => handleNavigation('calendario')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>Calendário</span>
          </Link>
          <Link href="#" className={`${styles.button} ${styles.diaDia}`} onClick={() => handleNavigation('dia-a-dia')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            <span>Dia a Dia</span>
          </Link>
          <Link href="#" className={`${styles.button} ${styles.avisos}`} onClick={() => handleNavigation('avisos')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span>Avisos</span>
          </Link>
          <Link href="#" className={`${styles.button} ${styles.imagens}`} onClick={() => handleNavigation('imagens')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <span>Imagens</span>
          </Link>
        </div>
      </main>

      {activePage && (
        <p className={styles.notification} role="status" aria-live="polite">
          Página atual: {activePage}
        </p>
      )}
    </div>
  )
}