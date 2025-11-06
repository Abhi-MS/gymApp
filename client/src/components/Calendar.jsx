// FullCalendarComponent.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // For dateClick

const CalendarComponent = ({ events = [], onDateClick }) => {
  // Handle date click
  const handleDateClick = (arg) => {
    // Always show workout planning popup
    onDateClick(arg.dateStr);
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="65vh"
        events={events}
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default CalendarComponent;
