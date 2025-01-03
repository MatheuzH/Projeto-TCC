"use client";
import { useState, useEffect } from "react";
import { db } from "../firebaseconfig"; // Firestore
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import "./galeria.css"; // Importar CSS
import { Home } from "lucide-react"; // Ícone de Home
import { useRouter } from "next/navigation";

const GalleryPage = () => {
  const router = useRouter();
  const [imageFileName, setImageFileName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const checkAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(checkAdmin);

    const q = query(collection(db, "gallery"), orderBy("datePosted", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGalleryItems(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => unsubscribe();
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleRemoveImage = async (id) => {
    const confirm = window.confirm(
      "Tem certeza que deseja remover esta imagem?"
    );
    if (confirm) {
      try {
        await deleteDoc(doc(db, "gallery", id));
      } catch (error) {
        console.error("Erro ao remover imagem:", error);
        alert("Erro ao remover imagem. Tente novamente.");
      }
    }
  };

  const handleBackToHome = () => {
    router.push("/"); // Redireciona para a Home Page
  };

  return (
    <div className="gallery-container">
      {/* Ícone de Home */}
      <div className="icon-home" onClick={handleBackToHome}>
        <Home size={32} />
      </div>
      <h1 className="gallery-title">Galeria</h1>

      {isAdmin && (
        <div className="gallery-button-container">
          <button className="gallery-button" onClick={() => setShowModal(true)}>
            Adicionar Imagem
          </button>
        </div>
      )}

      <div className="gallery-grid">
        {galleryItems.map((item) => (
          <div key={item.id} className="gallery-item">
            <img
              src={item.imageUrl}
              alt="Imagem"
              onClick={() => handleImageClick(item.imageUrl)}
            />
            <p className="gallery-caption">{item.caption}</p>
            <small className="gallery-date">
              {new Date(item.datePosted.toDate()).toLocaleDateString()}
            </small>
            {isAdmin && (
              <button
                className="remove-button"
                onClick={() => handleRemoveImage(item.id)}
              >
                Remover
              </button>
            )}
          </div>
        ))}
      </div>

      {showImageModal && (
        <div className="image-modal">
          <img
            src={selectedImage}
            alt="Visualização Ampliada"
            className="modal-image"
          />
          <button
            className="close-modal"
            onClick={() => setShowImageModal(false)}
          >
            Voltar
          </button>
        </div>
      )}

      {showModal && (
        <div className="gallery-modal">
          <h2>Adicionar Imagem</h2>
          <label htmlFor="file-upload" className="custom-file-upload">
            Escolher Imagem
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setImageFileName(file.name); // Armazena o nome do arquivo
              }
            }}
          />
          {imageFileName && (
            <p className="file-name-label">
              Arquivo selecionado: {imageFileName}
            </p>
          )}
          <input
            type="text"
            placeholder="Legenda"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button
            onClick={async () => {
              if (!imageFile || !caption) {
                alert("Por favor, escolha uma imagem e insira uma legenda.");
                return;
              }

              const reader = new FileReader();
              reader.readAsDataURL(imageFile);
              reader.onloadend = async () => {
                try {
                  const base64Image = reader.result;

                  const newImage = {
                    caption,
                    datePosted: new Date(),
                    imageUrl: base64Image,
                  };

                  const galleryRef = collection(db, "gallery");

                  await setDoc(doc(galleryRef), newImage);

                  alert("Imagem adicionada com sucesso!");
                  setShowModal(false);
                  setImageFile(null);
                  setImageFileName(""); // Reseta o nome do arquivo
                  setCaption("");
                } catch (error) {
                  console.error("Erro ao salvar imagem:", error);
                  alert("Erro ao adicionar imagem. Tente novamente.");
                }
              };

              reader.onerror = () => {
                console.error("Erro ao converter imagem para Base64.");
                alert("Erro ao processar a imagem. Tente novamente.");
              };
            }}
            className="upload-button"
          >
            Adicionar Imagem
          </button>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
