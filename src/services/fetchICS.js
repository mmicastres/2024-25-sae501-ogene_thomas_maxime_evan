// Importation nécessaire pour ICAL
import ICAL from "ical.js";

export const fetchICSData = async (url) => {
    try {
        const response = await fetch(url);
        const icsData = await response.text();

        // Parse ICS data
        const jcalData = ICAL.parse(icsData);
        const vcalendar = new ICAL.Component(jcalData);
        const events = vcalendar.getAllSubcomponents("vevent");

        // Map events to a more usable format
        return events.map((event) => {
            const vevent = new ICAL.Event(event);
            return {
                summary: vevent.summary,
                start: vevent.startDate.toJSDate(),
                end: vevent.endDate.toJSDate(),
                location: vevent.location,
                description: vevent.description,
            };
        });
    } catch (error) {
        console.error("Error fetching ICS data:", error);
        return null;
    }
};
