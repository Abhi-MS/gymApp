import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import CalendarComponent from "../components/Calendar";
import WeeklyPlan from "../components/WeeklyPlan";

export default function Home() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [nextWeekPlan, setNextWeekPlan] = useState({});
  const [selectedWeekPlan, setSelectedWeekPlan] = useState({});
  const [selectedWeekStart, setSelectedWeekStart] = useState(null);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const getNextWeekStart = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToAdd = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
    
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToAdd);
    
    // Format as YYYY-MM-DD using local time to avoid timezone issues
    const year = monday.getFullYear();
    const month = (monday.getMonth() + 1).toString().padStart(2, '0');
    const day = monday.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Get week start (Monday) for any date
  const getWeekStart = (date) => {
    const dayOfWeek = date.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1
    const monday = new Date(date);
    monday.setDate(date.getDate() - daysToSubtract);
    
    const year = monday.getFullYear();
    const month = (monday.getMonth() + 1).toString().padStart(2, '0');
    const day = monday.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Select a week to display in the sidebar
  const selectWeek = useCallback((weekStartStr) => {
    setSelectedWeekStart(weekStartStr);
    
    // Load the week's plan from localStorage and events
    const weekPlan = {};
    const weekStart = new Date(weekStartStr + 'T00:00:00');
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const year = day.getFullYear();
      const month = (day.getMonth() + 1).toString().padStart(2, '0');
      const dayNum = day.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${dayNum}`;
      
      // Check localStorage first
      const savedWorkouts = localStorage.getItem(dateStr);
      if (savedWorkouts) {
        weekPlan[dateStr] = JSON.parse(savedWorkouts);
      } else {
        // Check calendar events
        const dayEvents = calendarEvents.filter(event => 
          event.date === dateStr && event.isPlanned
        );
        if (dayEvents.length > 0) {
          weekPlan[dateStr] = dayEvents.map(event => event.workouts || []).flat();
        }
      }
    }
    
    setSelectedWeekPlan(weekPlan);
  }, [calendarEvents]);

  // Load initial data
  useEffect(() => {
    // Load calendar events
    const savedEvents = localStorage.getItem('workoutCalendarEvents');
    if (savedEvents) {
      setCalendarEvents(JSON.parse(savedEvents));
    }

    // Load next week plan
    const nextWeekKey = getNextWeekStart();
    const savedNextWeekPlan = localStorage.getItem(`weeklyPlan_${nextWeekKey}`);
    if (savedNextWeekPlan) {
      setNextWeekPlan(JSON.parse(savedNextWeekPlan));
    }
  }, []);

  // Initialize selected week after calendar events are loaded
  useEffect(() => {
    const nextWeekKey = getNextWeekStart();

    selectWeek(nextWeekKey);
  }, [selectWeek]);

  // Update selected week plan when calendar events change
  useEffect(() => {
    if (selectedWeekStart) {
      selectWeek(selectedWeekStart);
    }
  }, [calendarEvents, selectedWeekStart, selectWeek]);

  // Handle calendar date click to show planning popup
  const handleCalendarDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setShowPlanPopup(true);
    
    // Also select the week containing this date
    const clickedDate = new Date(dateStr + 'T00:00:00');
    const weekStart = getWeekStart(clickedDate);
    selectWeek(weekStart);
  };



  // Plan workout for selected date
  const planWorkout = (workoutType) => {
    if (!selectedDate) return;

    const workoutLabels = {
      'cardio': 'Cardio',
      'upperbody': 'Upper Body',
      'lowerbody': 'Lower Body', 
      'abs': 'Abs'
    };

    // Determine which week this date belongs to
    const selectedDateObj = new Date(selectedDate);
    const nextWeekStart = new Date(getNextWeekStart());
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    // Check if date is in next week
    if (selectedDateObj >= nextWeekStart && selectedDateObj <= nextWeekEnd) {
      // For next week's plan, we'll store as array to allow multiple workouts
      const currentPlan = nextWeekPlan[selectedDate] || [];
      const planArray = Array.isArray(currentPlan) ? currentPlan : [currentPlan].filter(Boolean);
      
      // Toggle workout in the plan
      let newPlanArray;
      if (planArray.includes(workoutType)) {
        newPlanArray = planArray.filter(w => w !== workoutType);
      } else {
        newPlanArray = [...planArray, workoutType];
      }
      
      const newNextWeekPlan = {
        ...nextWeekPlan,
        [selectedDate]: newPlanArray.length > 0 ? newPlanArray : null
      };
      
      setNextWeekPlan(newNextWeekPlan);
      localStorage.setItem(`weeklyPlan_${getNextWeekStart()}`, JSON.stringify(newNextWeekPlan));
    }

    // Handle calendar events - allow multiple events per day
    const existingEvents = calendarEvents.filter(event => event.date === selectedDate && event.isPlanned);
    const existingWorkoutEvent = existingEvents.find(event => event.id === `plan_${selectedDate}_${workoutType}`);
    
    let updatedEvents;
    if (existingWorkoutEvent) {
      // Remove existing workout event (toggle off)
      updatedEvents = calendarEvents.filter(event => event.id !== `plan_${selectedDate}_${workoutType}`);
    } else {
      // Add new workout event
      const newEvent = {
        title: workoutLabels[workoutType],
        date: selectedDate,
        id: `plan_${selectedDate}_${workoutType}`,
        isPlanned: true,
        backgroundColor: getWorkoutColor(workoutType),
        borderColor: getWorkoutColor(workoutType)
      };
      updatedEvents = [...calendarEvents, newEvent];
    }

    setCalendarEvents(updatedEvents);
    localStorage.setItem('workoutCalendarEvents', JSON.stringify(updatedEvents));
  };

  // Clear all workouts for selected date
  const clearDay = () => {
    if (!selectedDate) return;

    // Clear from next week's plan if applicable
    const selectedDateObj = new Date(selectedDate);
    const nextWeekStart = new Date(getNextWeekStart());
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    if (selectedDateObj >= nextWeekStart && selectedDateObj <= nextWeekEnd) {
      const newNextWeekPlan = {
        ...nextWeekPlan,
        [selectedDate]: null
      };
      setNextWeekPlan(newNextWeekPlan);
      localStorage.setItem(`weeklyPlan_${getNextWeekStart()}`, JSON.stringify(newNextWeekPlan));
    }

    // Remove all planned events for this date
    const updatedEvents = calendarEvents.filter(event => !(event.date === selectedDate && event.isPlanned));
    setCalendarEvents(updatedEvents);
    localStorage.setItem('workoutCalendarEvents', JSON.stringify(updatedEvents));
    
    setShowPlanPopup(false);
  };

  // Apply default workout split for next week
  const applyDefaultSplit = () => {
    const nextWeekStart = new Date(getNextWeekStart());
    const workoutLabels = {
      'upperbody': 'Upper Body',
      'lowerbody': 'Lower Body',
      'cardio': 'Cardio',
      'abs': 'Abs'
    };

    // Define the default split: Upper/Lower with Cardio and Abs
    // Index corresponds to days starting from Monday (0=Monday, 1=Tuesday, etc.)
    const defaultSplit = [
      ['upperbody'],      // Monday (index 0)
      ['lowerbody'],      // Tuesday (index 1)
      ['cardio'],         // Wednesday (index 2)
      ['upperbody'],      // Thursday (index 3)
      ['lowerbody'],      // Friday (index 4)
      ['abs'],            // Saturday (index 5)
      null                // Sunday (index 6) - Rest
    ];

    // Create the plan with actual dates
    const newPlan = {};
    const newCalendarEvents = [...calendarEvents];

    // Remove existing planned events for next week
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
    const filteredEvents = newCalendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return !(eventDate >= nextWeekStart && eventDate <= nextWeekEnd && event.isPlanned);
    });

    for (let i = 0; i < 7; i++) {
      const day = new Date(nextWeekStart);
      day.setDate(nextWeekStart.getDate() + i);
      const dateStr = day.toISOString().split('T')[0];
      
      if (defaultSplit[i]) {
        newPlan[dateStr] = defaultSplit[i];
        
        // Add calendar events for each workout
        defaultSplit[i].forEach(workoutType => {
          const newEvent = {
            title: workoutLabels[workoutType],
            date: dateStr,
            id: `plan_${dateStr}_${workoutType}`,
            isPlanned: true,
            backgroundColor: getWorkoutColor(workoutType),
            borderColor: getWorkoutColor(workoutType)
          };
          filteredEvents.push(newEvent);
        });
      }
    }

    // Update state and localStorage
    setNextWeekPlan(newPlan);
    setCalendarEvents(filteredEvents);
    localStorage.setItem(`weeklyPlan_${getNextWeekStart()}`, JSON.stringify(newPlan));
    localStorage.setItem('workoutCalendarEvents', JSON.stringify(filteredEvents));
  };

  // Clear the selected week
  const clearSelectedWeek = () => {
    setShowClearConfirm(true);
  };

  const confirmClearWeek = () => {
    if (!selectedWeekStart) return;

    const weekStart = new Date(selectedWeekStart + 'T00:00:00');
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Clear localStorage for this week's days using the same logic as selectWeek
    for (let i = 0; i < 7; i++) {
      // Use the same date calculation as in selectWeek function
      const day = new Date(selectedWeekStart + 'T00:00:00');
      day.setDate(day.getDate() + i);
      const year = day.getFullYear();
      const month = (day.getMonth() + 1).toString().padStart(2, '0');
      const dayNum = day.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${dayNum}`;
      localStorage.removeItem(dateStr);
    }

    // Remove planned events from calendar for this week
    const filteredEvents = calendarEvents.filter(event => {
      const eventDate = new Date(event.date + 'T00:00:00'); // Add time to match our date format
      const shouldKeep = !(eventDate >= weekStart && eventDate <= weekEnd && event.isPlanned);
      return shouldKeep;
    });

    // Update calendar events
    setCalendarEvents(filteredEvents);
    localStorage.setItem('workoutCalendarEvents', JSON.stringify(filteredEvents));

    // If this is next week, also clear the next week plan
    const nextWeekStart = getNextWeekStart();
    if (selectedWeekStart === nextWeekStart) {
      setNextWeekPlan({});
      localStorage.removeItem(`weeklyPlan_${nextWeekStart}`);
    }

    // Reset the selected week plan and refresh it
    setSelectedWeekPlan({});
    setShowClearConfirm(false);
    
    // Refresh the selected week to show the cleared state
    setTimeout(() => selectWeek(selectedWeekStart), 100);
  };

  const cancelClearWeek = () => {
    setShowClearConfirm(false);
  };

  // Navigate weeks (previous/next)
  const navigateWeek = (direction) => {
    if (!selectedWeekStart) return;
    
    const currentWeek = new Date(selectedWeekStart + 'T00:00:00');
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    
    const year = newWeek.getFullYear();
    const month = (newWeek.getMonth() + 1).toString().padStart(2, '0');
    const day = newWeek.getDate().toString().padStart(2, '0');
    const newWeekStart = `${year}-${month}-${day}`;
    
    selectWeek(newWeekStart);
  };

  // Get workout colors
  const getWorkoutColor = (workoutType) => {
    const colors = {
      'cardio': '#e74c3c',
      'upperbody': '#3498db',
      'lowerbody': '#2ecc71',
      'abs': '#f39c12'
    };
    return colors[workoutType] || '#95a5a6';
  };
  return (
    <>
    <div className="home">
      {/* Simple Description */}
      <div className="home-description">
        <p>Track your workouts, monitor progress, and achieve your fitness goals</p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Workout Groups */}
        <div className="workout-section">
          <h2 className="section-title">Choose Your Workout</h2>
          <div className="groups-grid">
            <Link to="/cardio" className="group-link">
              <div className="workout-card">
                <div className="workout-icon">❤️</div>
                <h3>Cardio</h3>
                <p>Boost your endurance</p>
              </div>
            </Link>
            <Link to="/upperbody" className="group-link">
              <div className="workout-card">
                <div className="workout-icon">💪</div>
                <h3>Upper Body</h3>
                <p>Strengthen your arms & chest</p>
              </div>
            </Link>
            <Link to="/lowerbody" className="group-link">
              <div className="workout-card">
                <div className="workout-icon">🦵</div>
                <h3>Lower Body</h3>
                <p>Build powerful legs</p>
              </div>
            </Link>
            <Link to="/abs" className="group-link">
              <div className="workout-card">
                <div className="workout-icon">🔥</div>
                <h3>Abs</h3>
                <p>Core strengthening</p>
              </div>
            </Link>
            <Link to="/progress" className="group-link">
              <div className="workout-card progress-card">
                <div className="workout-icon">📊</div>
                <h3>Progress</h3>
                <p>Track your improvements</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="calendar-section">
          <h2 className="section-title">Workout Calendar</h2>

          <div className="calendar">
            <CalendarComponent 
              events={calendarEvents}
              onDateClick={handleCalendarDateClick}
            />
          </div>
        </div>

        {/* Week Navigation - Moved near Weekly Plan */}
        <div className="week-navigation">
          <button 
            className="week-nav-btn"
            onClick={() => navigateWeek(-1)}
            title="Previous Week"
          >
            <span className="btn-text-long">← Previous Week</span>
            <span className="btn-text-short">← Prev</span>
          </button>
          
          <div className="current-week-display">
            <span className="week-label">Viewing: </span>
            <span className="week-dates">
              {selectedWeekStart ? (() => {
                const start = new Date(selectedWeekStart + 'T00:00:00');
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
              })() : 'Loading...'}
            </span>
          </div>
          
          <button 
            className="week-nav-btn"
            onClick={() => navigateWeek(1)}
            title="Next Week"
          >
            <span className="btn-text-long">Next Week →</span>
            <span className="btn-text-short">Next →</span>
          </button>
        </div>

        {/* Selected Week Plan Section */}
        <div className="weekly-plan-section">
          <WeeklyPlan 
            weekPlan={selectedWeekPlan}
            weekStart={selectedWeekStart}
            isNextWeek={selectedWeekStart === getNextWeekStart()}
            onApplyDefaultSplit={applyDefaultSplit}
            onClearWeek={clearSelectedWeek}
          />
        </div>
      </div>

      {/* Planning Popup */}
      {showPlanPopup && (() => {
        // Get current workouts for selected date
        const currentWorkouts = calendarEvents
          .filter(event => event.date === selectedDate && event.isPlanned)
          .map(event => {
            const workoutKey = Object.entries({
              'cardio': 'Cardio',
              'upperbody': 'Upper Body',
              'lowerbody': 'Lower Body', 
              'abs': 'Abs'
            }).find(([key, label]) => label === event.title)?.[0];
            return workoutKey;
          })
          .filter(Boolean);

        return (
          <div className="popup-overlay" onClick={() => setShowPlanPopup(false)}>
            <div className="plan-popup" onClick={(e) => e.stopPropagation()}>
              <h3>Plan workout for {selectedDate}</h3>
              <p>Click to add/remove workouts:</p>
              <div className="workout-options-popup">
                <button 
                  className={`workout-btn cardio ${currentWorkouts.includes('cardio') ? 'selected' : ''}`}
                  onClick={() => planWorkout('cardio')}
                >
                  ❤️ Cardio
                </button>
                <button 
                  className={`workout-btn upperbody ${currentWorkouts.includes('upperbody') ? 'selected' : ''}`}
                  onClick={() => planWorkout('upperbody')}
                >
                  💪 Upper Body
                </button>
                <button 
                  className={`workout-btn lowerbody ${currentWorkouts.includes('lowerbody') ? 'selected' : ''}`}
                  onClick={() => planWorkout('lowerbody')}
                >
                  🦵 Lower Body
                </button>
                <button 
                  className={`workout-btn abs ${currentWorkouts.includes('abs') ? 'selected' : ''}`}
                  onClick={() => planWorkout('abs')}
                >
                  🔥 Abs
                </button>
              </div>
              
              <div className="popup-actions">
                <button className="clear-btn" onClick={clearDay}>
                  🗑️ Clear Day
                </button>
                <button className="done-btn" onClick={() => setShowPlanPopup(false)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Clear Week Confirmation Modal */}
      {showClearConfirm && (
        <div className="popup-overlay" onClick={cancelClearWeek}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-header">
              <h3>🗑️ Clear Week</h3>
            </div>
            <div className="confirmation-content">
              <p>Are you sure you want to clear all workouts for {selectedWeekStart === getNextWeekStart() ? 'next week' : 'this week'}?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="confirmation-actions">
              <button className="cancel-btn" onClick={cancelClearWeek}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmClearWeek}>
                Clear Week
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}