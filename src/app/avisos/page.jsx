"use client";
import { useEffect, useState } from 'react';
import { db } from '../firebaseconfig.js';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react'; // Ícone de Home
import "./avisos.css";

export default function Avisos() {
    const router = useRouter();
    const [avisos, setAvisos] = useState([]);
    const [novoAviso, setNovoAviso] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // Verifica se o usuário é administrador
        const adminStatus = localStorage.getItem("isAdmin") === "true";
        setIsAdmin(adminStatus);

        // Carrega os avisos ao carregar a página
        const carregarAvisos = async () => {
            try {
                const avisosCollection = collection(db, "Avisos");
                const avisoSnapshot = await getDocs(avisosCollection);
                const avisoList = avisoSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Ordena os avisos pela data, do mais recente ao mais antigo
                avisoList.sort((a, b) => b.data.toDate() - a.data.toDate());
                setAvisos(avisoList);
            } catch (error) {
                console.error("Erro ao carregar avisos:", error);
            }
        };

        carregarAvisos();
    }, []);

    const adicionarAviso = async () => {
        if (novoAviso.trim() === '') return; // Valida se há conteúdo no aviso

        try {
            const docRef = await addDoc(collection(db, "Avisos"), {
                texto: novoAviso,
                data: Timestamp.fromDate(new Date()),
            });
            setAvisos((prevAvisos) => [
                { id: docRef.id, texto: novoAviso, data: new Date() }, // Adiciona o novo aviso no início
                ...prevAvisos,
            ]);
            setNovoAviso('');
            fecharModal();
        } catch (error) {
            console.error("Erro ao adicionar aviso:", error);
        }
    };

    const abrirModal = () => setModalOpen(true);
    const fecharModal = () => setModalOpen(false);

    const handleBackToHome = () => {
        router.push('/'); // Redireciona para a Home Page
    };

    return (
        <div className="avisos-container">
            {/* Ícone de Home */}
            <div className="icon-home" onClick={handleBackToHome}>
                <Home size={32} />
            </div>

            <h1 className="avisos-title">Avisos da Creche</h1>

            {/* Botão de Adicionar Aviso (apenas para administradores) */}
            {isAdmin && (
                <button className="add-button" onClick={abrirModal}>
                    +
                </button>
            )}

            {/* Lista de Avisos */}
            <div className="avisos-list">
                {avisos.map((aviso) => (
                    <div key={aviso.id} className="aviso-card">
                        <p className="aviso-text">{aviso.texto}</p>
                        <span className="aviso-date">
                            Data: {(aviso.data instanceof Timestamp ? aviso.data.toDate() : aviso.data).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>

            {/* Modal para Adicionar Aviso */}
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={fecharModal}>
                            &times;
                        </span>
                        <h2>Novo Aviso</h2>
                        <textarea
                            value={novoAviso}
                            onChange={(e) => setNovoAviso(e.target.value)}
                            placeholder="Escreva sua mensagem"
                        />
                        <button onClick={adicionarAviso} className="save-button">
                            Salvar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
