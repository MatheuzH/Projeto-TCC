"use client";
import { useState, useEffect } from 'react';
import { db } from '../firebaseconfig'; // Firestore
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importar estilos do calendário
import './calendar.css'; // Importar CSS personalizado

const CalendarPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [value, setValue] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showHolidayModal, setShowHolidayModal] = useState(false); // Modal para adicionar feriados
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [holidayTitle, setHolidayTitle] = useState('');
    const [holidayDescription, setHolidayDescription] = useState('');
    const [holidayDate, setHolidayDate] = useState(new Date());

    useEffect(() => {
        const checkAdmin = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(checkAdmin);

        const q = query(collection(db, 'events'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, []);

    const handleDayClick = (date) => {
        setSelectedDate(date);
        const dayEvents = events.filter(
            (event) => event.date.toDate().toISOString().split('T')[0] === date.toISOString().split('T')[0]
        );
        setSelectedEvents(dayEvents);
        setShowEventModal(true);
    };

    const handleAddHoliday = async () => {
        try {
            await addDoc(collection(db, 'events'), {
                title: holidayTitle,
                date: holidayDate,
                description: holidayDescription,
                type: "holiday",
            });
            alert('Feriado adicionado com sucesso!');
            setShowHolidayModal(false);
            setHolidayTitle('');
            setHolidayDescription('');
            setHolidayDate(new Date());
        } catch (error) {
            console.error('Erro ao adicionar feriado:', error);
            alert('Erro ao adicionar feriado. Tente novamente.');
        }
    };

    const renderTileContent = ({ date }) => {
        const formattedDate = date.toISOString().split('T')[0];
        const dayEvents = events.filter(
            (event) => event.date.toDate().toISOString().split('T')[0] === formattedDate
        );
        return dayEvents.map((event, index) => (
            <div key={index} className={`event-tag ${event.type}`}>
                {event.title}
            </div>
        ));
    };

    return (
        <div className="calendar-container">
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
                    <button className="add-event-button" onClick={() => setShowHolidayModal(true)}>
                        Adicionar Feriado
                    </button>
                </div>
            )}

            {showHolidayModal && (
                <div className="holiday-modal">
                    <h2>Adicionar Feriado</h2>
                    <input
                        type="date"
                        value={holidayDate.toISOString().split('T')[0]}
                        onChange={(e) => setHolidayDate(new Date(e.target.value))}
                    />
                    <input
                        type="text"
                        placeholder="Título do Feriado"
                        value={holidayTitle}
                        onChange={(e) => setHolidayTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Descrição"
                        value={holidayDescription}
                        onChange={(e) => setHolidayDescription(e.target.value)}
                    ></textarea>
                    <button onClick={handleAddHoliday}>Adicionar Feriado</button>
                    <button onClick={() => setShowHolidayModal(false)}>Cancelar</button>
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
