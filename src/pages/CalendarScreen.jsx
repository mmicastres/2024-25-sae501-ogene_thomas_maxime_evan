import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import ICAL from "ical.js"; // Importation de ICAL pour le traitement du fichier ICS
import { fetchICSData } from "../services/fetchICS"; // Import de la fonction fetchICSData depuis les services

const localizer = momentLocalizer(moment);

const CalendarScreen = () => {
    const [events, setEvents] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(""); // Etat pour stocker l'emplacement sélectionné
    const url = "/calendar.ics"; // Chemin vers le fichier ICS local dans le dossier public

    useEffect(() => {
        const getData = async () => {
            const data = await fetchICSData(url);
            if (data) {
                const eventList = Object.values(data);
                setEvents(eventList);
            }
            console.log(data);
        };

        getData();
    }, []);

    // Filtre les événements par emplacement
    const filteredEvents = events.filter((event) => {
        if (!event.location) return false;
        // Vérifie si le location contient selectedLocation n'importe où dans la chaîne
        return event.location.split(";").some((loc) => loc.trim() === selectedLocation);
    });

    return (
        <div>
            <h1>Emploi du Temps</h1>

            {/* Sélecteur pour choisir l'emplacement */}
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="">---</option>
                <option value="M02-TD">M02-TD</option>
                <option value="M03-TP">M03-TP</option>
                <option value="M05-TP">M05-TP</option>
                <option value="M06-TP">M06-TP</option>
                <option value="M09-TP">M09-TP</option>
                {/* Ajoutez d'autres options selon vos besoins */}
            </select>

            {filteredEvents.length > 0 && (
                <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    startAccessor="start"
                    endAccessor="end"
                    titleAccessor="summary"
                    style={{ height: "80vh" }}
                />
            )}
        </div>
    );
};

export default CalendarScreen;
