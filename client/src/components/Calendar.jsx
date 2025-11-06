// FullCalendarComponent.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // For dateClick

const CalendarComponent = () => {
  // Load events from localStorage or use default events
  const loadEvents = () => {
    const savedEvents = localStorage.getItem('workoutCalendarEvents');
    if (savedEvents) {
      return JSON.parse(savedEvents);
    }
    // Default events if no saved data
    return [
      { title: 'Biceps', date: '2024-09-13' },
      { title: 'Legs', date: '2024-09-14' }
    ];
  };

  const [events, setEvents] = useState(loadEvents());

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('workoutCalendarEvents', JSON.stringify(events));
  }, [events]);

  // Handle date click
  const handleDateClick = (arg) => {
    // Prompt for the activity summary
    const activity = prompt(`Enter an activity for ${arg.dateStr}`);
    if (activity) {
      // Add the new activity to the events state
      const newEvent = { 
        title: activity, 
        date: arg.dateStr,
        id: Date.now() // Simple unique ID
      };
      setEvents([...events, newEvent]);
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="65vh"
        events={events}
        dateClick={handleDateClick} // Handle date click
      />
    </div>
  );
};

export default CalendarComponent;
