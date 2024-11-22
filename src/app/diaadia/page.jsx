"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../firebaseconfig";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Home } from "lucide-react"; // Ícone de Home
import "./dia.css";

const DiaADia = () => {
  const [data, setData] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [atividades, setAtividades] = useState({
    dormiu: false,
    almocou: false,
    defecou: false,
  });
  const [privilegio, setPrivilegio] = useState(null);
  const [filhos, setFilhos] = useState([]);
  const [selectedFilho, setSelectedFilho] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserPrivileges(user.uid);
      } else {
        // Se o usuário não estiver logado, redireciona para a página de login
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserPrivileges = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "Users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setPrivilegio(userData.privilegio);

        if (userData.privilegio === "responsável") {
          setFilhos(userData.filhos || []);
        } else if (userData.privilegio === "admin") {
          const usersSnapshot = await getDocs(collection(db, "Users"));
          const allFilhos = [];
          usersSnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            if (userData.filhos) {
              userData.filhos.forEach((filho) => allFilhos.push(filho));
            }
          });
          setFilhos(allFilhos);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar privilégios:", error);
    }
  };

  const loadData = async () => {
    if (data && selectedFilho) {
      const docRef = doc(db, "afazeres", data, "crianca", selectedFilho.nome);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        setObservacoes(docData.observacoes || "");
        setAtividades(
          docData.atividades || {
            dormiu: false,
            almocou: false,
            defecou: false,
          }
        );
      } else {
        setObservacoes("");
        setAtividades({ dormiu: false, almocou: false, defecou: false });
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [data, selectedFilho]);

  const handleSave = async () => {
    if (privilegio !== "admin") {
      alert("Apenas administradores podem salvar alterações.");
      return;
    }

    if (!selectedFilho) {
      alert("Por favor, selecione uma criança antes de salvar.");
      return;
    }

    try {
      const docRef = doc(db, "afazeres", data, "crianca", selectedFilho.nome);
      await setDoc(docRef, {
        data,
        observacoes,
        atividades,
      });
      alert("Dados salvos com sucesso");
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      alert("Erro ao salvar dados");
    }
  };

  const handleBackToHome = () => {
    router.push('/'); // Redireciona para a Home Page
};

  return (
    <div className="diaContainer">
      {/* Ícone de Home */}
      <div className="icon-home" onClick={handleBackToHome}>
        <Home size={32} />
      </div>
      <h1 className="diaTitle">Registro Diário das Atividades</h1>
      <p className="privilegio">Usuário: {privilegio}</p>
      <div className="diaForm">
        <label className="diaLabel">Data do Registro:</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="diaInput"
          required
        />

        {filhos.length > 0 && (
          <>
            <label className="diaLabel">Selecione a criança:</label>
            <select
              value={selectedFilho ? JSON.stringify(selectedFilho) : ""}
              onChange={(e) => setSelectedFilho(JSON.parse(e.target.value))}
              className="diaSelect"
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

        <label className="diaLabel">Observações:</label>
        {privilegio === "admin" ? (
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Observações do dia"
            className="diaTextarea"
          />
        ) : (
          <p>{observacoes || "Sem observações para esta data."}</p>
        )}

        <h3>Atividades</h3>
        <div className="checkboxGroup">
          {["dormiu", "almocou", "defecou"].map((atividade) => (
            <label key={atividade} className="checkboxItem">
              <input
                type="checkbox"
                checked={atividades[atividade]}
                onChange={(e) =>
                  privilegio === "admin" &&
                  setAtividades({
                    ...atividades,
                    [atividade]: e.target.checked,
                  })
                }
                className="diaCheckbox"
              />
              <span className="customCheckbox"></span>
              {atividade.charAt(0).toUpperCase() + atividade.slice(1)}
            </label>
          ))}
        </div>

        {privilegio === "admin" && (
          <button onClick={handleSave} className="diaSaveButton">
            Salvar
          </button>
        )}
      </div>
    </div>
  );
};

export default DiaADia;
