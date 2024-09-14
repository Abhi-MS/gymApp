// FullCalendarComponent.js
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // For dateClick

const CalendarComponent = () => {
  // Example event data
  const [events, setEvents] = useState([
    { title: 'Completed React project', date: '2024-09-13' },
    { title: 'Started learning Redux', date: '2024-09-14' }
  ]);

  // Handle date click
  const handleDateClick = (arg) => {
    // Prompt for the activity summary
    const activity = prompt(`Enter an activity for ${arg.dateStr}`);
    if (activity) {
      // Add the new activity to the events state
      setEvents([...events, { title: activity, date: arg.dateStr }]);
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
