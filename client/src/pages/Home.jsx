import React, { useState, useEffect } from "react";
import Group from "../components/Group";
import { Link } from "react-router-dom";
import CalendarComponent from "../components/Calendar";
import WeeklyPlan from "../components/WeeklyPlan";

export default function Home() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [nextWeekPlan, setNextWeekPlan] = useState({});
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Helper functions
  const getCurrentWeekStart = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday.toISOString().split('T')[0];
  };

  const getNextWeekStart = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 8);
    return monday.toISOString().split('T')[0];
  };

  // Load initial data
  useEffect(() => {
    // Load calendar events
    const savedEvents = localStorage.getItem('workoutCalendarEvents');
    if (savedEvents) {
      setCalendarEvents(JSON.parse(savedEvents));
    }

    // Load next week's plan
    const nextWeekKey = getNextWeekStart();
    const savedNextWeekPlan = localStorage.getItem(`weeklyPlan_${nextWeekKey}`);
    if (savedNextWeekPlan) {
      setNextWeekPlan(JSON.parse(savedNextWeekPlan));
    }
  }, []);

  // Handle calendar date click to show planning popup
  const handleCalendarDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setShowPlanPopup(true);
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
          </div>
        </div>

        {/* Right Side Content */}
        <div className="right-content">
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

          {/* Next Week Plan Section */}
          <div className="weekly-plan-section">
            <h2 className="section-title">Next Week's Plan</h2>
            <WeeklyPlan 
              nextWeekPlan={nextWeekPlan}
            />
          </div>
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
    </div>
    </>
  );
}