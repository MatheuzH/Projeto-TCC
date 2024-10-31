"use client"
import { useState, useEffect } from 'react';
import { db, auth } from '../firebaseconfig';
import { doc, getDoc, collection, getDocs, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

const DiaADia = () => {
    const [data, setData] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [atividades, setAtividades] = useState({
        dormiu: false,
        almocou: false,
        defecou: false,
    });
    const [privilegio, setPrivilegio] = useState(null);
    const [filhos, setFilhos] = useState([]);
    const [selectedFilho, setSelectedFilho] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Usuário autenticado com UID:", user.uid);
                await fetchUserPrivileges(user.uid);
            } else {
                console.log("Usuário não autenticado.");
                setPrivilegio(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserPrivileges = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'Users', uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setPrivilegio(userData.privilegio);
                console.log("Privilégio do usuário:", userData.privilegio);

                if (userData.privilegio === "pai") {
                    setFilhos(userData.filhos || []);
                } else if (userData.privilegio === "admin") {
                    const usersSnapshot = await getDocs(collection(db, 'Users'));
                    const allFilhos = [];
                    usersSnapshot.forEach((userDoc) => {
                        const userData = userDoc.data();
                        if (userData.filhos) {
                            userData.filhos.forEach((filho) => allFilhos.push(filho));
                        }
                    });
                    setFilhos(allFilhos);
                }
            } else {
                console.log("Documento do usuário não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar privilégios:", error);
        }
    };

    const loadData = async () => {
        if (data && selectedFilho) {
            const docRef = doc(db, 'afazeres', data, 'crianca', selectedFilho.nome);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const docData = docSnap.data();
                setObservacoes(docData.observacoes || '');
                setAtividades(docData.atividades || { dormiu: false, almocou: false, defecou: false });
            } else {
                setObservacoes('');
                setAtividades({ dormiu: false, almocou: false, defecou: false });
            }
        }
    };

    useEffect(() => {
        loadData();
    }, [data, selectedFilho]);

    const handleSave = async () => {
        if (privilegio !== 'admin') {
            alert('Apenas administradores podem salvar alterações.');
            return;
        }

        if (!selectedFilho) {
            alert('Por favor, selecione uma criança antes de salvar.');
            return;
        }

        try {
            const docRef = doc(db, 'afazeres', data, 'crianca', selectedFilho.nome);
            await setDoc(docRef, {
                data,
                observacoes,
                atividades,
            });
            alert('Dados salvos com sucesso');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Erro ao salvar dados');
        }
    };

    return (
        <div>
            <h1>Registro Diário das Atividades</h1>
            <p>Privilégio do usuário: {privilegio}</p>
            <label>Data do Registro:</label>
            <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
            />

            {filhos.length > 0 && (
                <>
                    <label>Selecione a criança:</label>
                    <select
                        value={selectedFilho ? JSON.stringify(selectedFilho) : ''}
                        onChange={(e) => setSelectedFilho(JSON.parse(e.target.value))}
                    >
                        <option value="">Selecione</option>
                        {filhos.map((filho, index) => (
                            <option key={index} value={JSON.stringify(filho)}>
                                {filho.nome} - {filho.turma}
                            </option>
                        ))}
                    </select>
                </>
            )}

            <label>Observações:</label>
            {privilegio === 'admin' ? (
                <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações do dia"
                />
            ) : (
                <p>{observacoes || "Sem observações para esta data."}</p>
            )}

            <h3>Atividades</h3>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={atividades.dormiu}
                        onChange={(e) =>
                            privilegio === 'admin' && setAtividades({ ...atividades, dormiu: e.target.checked })
                        }
                        disabled={privilegio !== 'admin'}
                    />
                    Dormiu
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={atividades.almocou}
                        onChange={(e) =>
                            privilegio === 'admin' && setAtividades({ ...atividades, almocou: e.target.checked })
                        }
                        disabled={privilegio !== 'admin'}
                    />
                    Almoçou
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={atividades.defecou}
                        onChange={(e) =>
                            privilegio === 'admin' && setAtividades({ ...atividades, defecou: e.target.checked })
                        }
                        disabled={privilegio !== 'admin'}
                    />
                    Defecou
                </label>
            </div>

            {privilegio === 'admin' && <button onClick={handleSave}>Salvar</button>}
        </div>
    );
};

export default DiaADia;
