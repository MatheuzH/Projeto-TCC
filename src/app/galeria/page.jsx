"use client";
import { useState, useEffect } from 'react';
import { db } from '../firebaseconfig'; // Firestore
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import './galeria.css'; // Importar CSS

const GalleryPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [galleryItems, setGalleryItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [caption, setCaption] = useState('');

    useEffect(() => {
        const checkAdmin = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(checkAdmin);

        const q = query(collection(db, 'gallery'), orderBy('datePosted', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setGalleryItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, []);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    const handleRemoveImage = async (id) => {
        const confirm = window.confirm("Tem certeza que deseja remover esta imagem?");
        if (confirm) {
            try {
                await deleteDoc(doc(db, 'gallery', id));
                alert("Imagem removida com sucesso!");
            } catch (error) {
                console.error("Erro ao remover imagem:", error);
                alert("Erro ao remover imagem. Tente novamente.");
            }
        }
    };

    return (
        <div className="gallery-container">
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
                    <img src={selectedImage} alt="Visualização Ampliada" className="modal-image" />
                    <button className="close-modal" onClick={() => setShowImageModal(false)}>
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
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                    <input
                        type="text"
                        placeholder="Legenda"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <button onClick={() => setShowModal(false)}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
