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

  // Process events to add CSS classes based on workout type
  const processedEvents = events.map(event => {
    const workoutType = event.title?.toLowerCase().replace(' ', '');
    return {
      ...event,
      className: workoutType // This will add cardio, upperbody, lowerbody, abs classes
    };
  });

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="65vh"
        events={processedEvents}
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next' // Move next button to right side
        }}
        dayMaxEvents={3} // Limit events per day for cleaner look
        moreLinkClick="popover"
        eventDisplay="block"
        displayEventTime={false} // Hide time since these are all-day events
      />
    </div>
  );
};

export default CalendarComponent;
