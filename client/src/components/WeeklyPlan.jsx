import React from "react";

function WeeklyPlan({ nextWeekPlan = {}, onApplyDefaultSplit }) {
  // Get next week's Monday date as string
  const getNextWeekStart = () => {
    const today = new Date();
    // Get the day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = today.getDay();
    // Calculate days to add to get to next Monday
    const daysToAdd = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
    
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToAdd);
    
    // Format as YYYY-MM-DD using local time to avoid timezone issues
    const year = monday.getFullYear();
    const month = (monday.getMonth() + 1).toString().padStart(2, '0');
    const day = monday.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Get days of next week
  const getNextWeekDays = () => {
    const days = [];
    const weekStartStr = getNextWeekStart();
    const weekStart = new Date(weekStartStr + 'T00:00:00'); // Add time to avoid timezone issues
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      
      // Format date consistently
      const year = day.getFullYear();
      const month = (day.getMonth() + 1).toString().padStart(2, '0');
      const dayNum = day.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${dayNum}`;
      
      days.push({
        date: dateStr,
        dayName: day.toLocaleDateString('en-US', { weekday: 'long' }),
        dayShort: day.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: day.getDate(),
        isToday: false // Next week can't contain today
      });
    }
    return days;
  };

  const workoutOptions = [
    { key: 'cardio', label: 'Cardio', icon: '❤️', color: '#e74c3c' },
    { key: 'upperbody', label: 'Upper', icon: '💪', color: '#3498db' },
    { key: 'lowerbody', label: 'Lower', icon: '🦵', color: '#2ecc71' },
    { key: 'abs', label: 'Abs', icon: '🔥', color: '#f39c12' }
  ];

  const nextWeekDays = getNextWeekDays();
  const hasAnyPlan = Object.values(nextWeekPlan).some(plan => plan);

  return (
    <div className="weekly-plan">
      {!hasAnyPlan && (
        <div className="no-plan-message">
          <p>📅 Next week is not planned yet</p>
          <span>Click on calendar days to plan your workouts</span>
          <div className="default-split-suggestion">
            <p className="suggestion-text">💡 Want a proven workout split?</p>
            <button 
              className="apply-split-btn"
              onClick={onApplyDefaultSplit}
            >
              Apply Upper/Lower Split
            </button>
            <div className="split-preview">
              <small>Mon: Upper Body • Tue: Lower Body • Wed: Cardio • Thu: Upper Body • Fri: Lower Body • Sat: Abs • Sun: Rest</small>
            </div>
          </div>
        </div>
      )}
      
      <div className="week-days">
        {nextWeekDays.map((day) => (
          <div 
            key={day.date} 
            className={`day-card read-only ${nextWeekPlan[day.date] ? 'planned' : ''}`}
          >
            <div className="day-header">
              <span className="day-name">{day.dayShort}</span>
              <span className="day-number">{day.dayNumber}</span>
            </div>
            
            {nextWeekPlan[day.date] ? (
              <div className="planned-workout">
                {Array.isArray(nextWeekPlan[day.date]) ? (
                  <div className="multiple-workouts">
                    {nextWeekPlan[day.date].map((workout, index) => (
                      <span key={workout} className="workout-item">
                        {workoutOptions.find(w => w.key === workout)?.icon}
                        {workoutOptions.find(w => w.key === workout)?.label}
                        {index < nextWeekPlan[day.date].length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                ) : (
                  <>
                    {workoutOptions.find(w => w.key === nextWeekPlan[day.date])?.icon}
                    <span>{workoutOptions.find(w => w.key === nextWeekPlan[day.date])?.label}</span>
                  </>
                )}
              </div>
            ) : (
              <div className="plan-workout">
                <span>Not planned</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyPlan;