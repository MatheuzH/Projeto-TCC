"use client";
import { useState, useEffect } from "react";
import { db } from "../firebaseconfig"; // Firestore
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import Calendar from "react-calendar";
import { Home } from "lucide-react"; // Ícone de Home
import { useRouter } from "next/navigation";
import "react-calendar/dist/Calendar.css"; // Importar estilos do calendário
import "./calendar.css"; // Importar CSS personalizado

const CalendarPage = () => {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [value, setValue] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventType, setEventType] = useState("");
    const [eventDate, setEventDate] = useState(new Date());

    useEffect(() => {
        const checkAdmin = localStorage.getItem("isAdmin") === "true";
        setIsAdmin(checkAdmin);

        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, []);

    const handleDayClick = (date) => {
        setSelectedDate(date);
        const dayEvents = events.filter(
            (event) => event.date.toDate().toISOString().split("T")[0] === date.toISOString().split("T")[0]
        );
        setSelectedEvents(dayEvents);
        setShowEventModal(true);
    };

    const handleAddEvent = async () => {
        if (!eventType || !eventTitle) {
            alert("Por favor, preencha o tipo e o título do evento.");
            return;
        }

        try {
            await addDoc(collection(db, "events"), {
                title: eventTitle,
                date: eventDate,
                description: eventDescription,
                type: eventType,
            });
            alert("Evento adicionado com sucesso!");
            setShowModal(false);
            setEventTitle("");
            setEventDescription("");
            setEventType("");
            setEventDate(new Date());
        } catch (error) {
            console.error("Erro ao adicionar evento:", error);
            alert("Erro ao adicionar evento. Tente novamente.");
        }
    };

    const renderTileContent = ({ date }) => {
        const formattedDate = date.toISOString().split("T")[0];
        const dayEvents = events.filter(
            (event) => event.date.toDate().toISOString().split("T")[0] === formattedDate
        );

        return dayEvents.map((event, index) => (
            <div
                key={index}
                className={`event-tag ${event.type === "holiday" ? "holiday-tag" : "event-tag"}`}
            >
                {event.title}
            </div>
        ));
    };

    const handleBackToHome = () => {
        router.push("/"); // Redireciona para a Home Page
    };

    return (
        <div className="calendar-container">
            {/* Ícone de Home */}
            <div className="icon-home" onClick={handleBackToHome}>
                <Home size={32} />
            </div>
            <h1 className="calendar-title">Calendário</h1>
            <Calendar
                onChange={setValue}
                value={value}
                onClickDay={handleDayClick}
                tileContent={renderTileContent}
                locale="pt-BR" // Força consistência em português
                className="custom-calendar"
            />

            {isAdmin && (
                <div className="admin-controls">
                    <button className="add-event-button" onClick={() => setShowModal(true)}>
                        Adicionar Evento ou Feriado
                    </button>
                </div>
            )}

            {showModal && (
                <div className="holiday-modal">
                    <h2>Adicionar Evento ou Feriado</h2>

                    {/* Tipo */}
                    <label htmlFor="event-type">Tipo:</label>
                    <select
                        id="event-type"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="custom-select"
                    >
                        <option value="">Selecione o tipo</option>
                        <option value="holiday">Feriado</option>
                        <option value="event">Evento</option>
                    </select>

                    {/* Data */}
                    <label htmlFor="event-date">Data:</label>
                    <input
                        id="event-date"
                        type="date"
                        value={eventDate.toISOString().split("T")[0]}
                        onChange={(e) => setEventDate(new Date(e.target.value))}
                    />

                    {/* Título */}
                    <label htmlFor="event-title">Título:</label>
                    <input
                        id="event-title"
                        type="text"
                        placeholder="Título do Evento ou Feriado"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                    />

                    {/* Descrição */}
                    <label htmlFor="event-description">Descrição:</label>
                    <textarea
                        id="event-description"
                        placeholder="Descrição"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                    ></textarea>

                    {/* Botões */}
                    <button onClick={handleAddEvent}>Adicionar</button>
                    <button onClick={() => setShowModal(false)}>Cancelar</button>
                </div>
            )}

            {showEventModal && (
                <div className="event-view-modal">
                    <h2>Eventos do Dia</h2>
                    {selectedEvents.length > 0 ? (
                        selectedEvents.map((event) => (
                            <div key={event.id} className="event-details">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum evento neste dia.</p>
                    )}
                    <button onClick={() => setShowEventModal(false)}>Fechar</button>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
