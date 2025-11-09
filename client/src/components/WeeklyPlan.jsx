import React from "react";

function WeeklyPlan({ 
  weekPlan = {}, 
  weekStart = null, 
  isNextWeek = false, 
  onApplyDefaultSplit, 
  onClearWeek,
  onWeekPlanUpdate,
  canClearWeek = true
}) {

  // Use the provided weekStart or fallback to next week calculation
  const getWeekStartDate = () => {
    if (weekStart) return weekStart;
    
    // Fallback: calculate next week
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToAdd = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToAdd);
    const year = monday.getFullYear();
    const month = (monday.getMonth() + 1).toString().padStart(2, '0');
    const day = monday.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get days of the selected week
  const getWeekDays = () => {
    const days = [];
    const weekStartStr = getWeekStartDate();
    const weekStartDate = new Date(weekStartStr + 'T00:00:00'); // Add time to avoid timezone issues
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStartDate);
      day.setDate(weekStartDate.getDate() + i);
      
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
        isToday: dateStr === new Date().toISOString().split('T')[0]
      });
    }
    return days;
  };

  const workoutOptions = [
    { key: 'cardio', label: 'Cardio', icon: '❤️', color: '#e74c3c', group: 'Cardiovascular' },
    { key: 'upperbody', label: 'Upper Body', icon: '💪', color: '#3498db', group: 'Upper Body' },
    { key: 'lowerbody', label: 'Lower Body', icon: '🦵', color: '#2ecc71', group: 'Lower Body' },
    { key: 'abs', label: 'Abs', icon: '🔥', color: '#f39c12', group: 'Abs' }
  ];

  const weekDays = getWeekDays();
  const hasAnyPlan = Object.values(weekPlan).some(plan => plan);
  
  // Get week title
  const getWeekTitle = () => {
    const weekStartDate = getWeekStartDate();
    
    if (isNextWeek) return "Next Week's Plan";
    
    const startDate = new Date(weekStartDate + 'T00:00:00');
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    };
    
    return `Week of ${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className="weekly-plan">
      <div className="week-header">
        <h3 className="week-title">{getWeekTitle()}</h3>
        {hasAnyPlan && (
          <button 
            className={`clear-week-btn ${!canClearWeek ? 'disabled' : ''}`}
            onClick={canClearWeek ? onClearWeek : undefined}
            disabled={!canClearWeek}
            title={
              !canClearWeek 
                ? 'Cannot clear the current/upcoming week' 
                : `Clear all workouts for ${isNextWeek ? 'next week' : 'this week'}`
            }
          >
            🗑️ Clear Week
          </button>
        )}
      </div>

      {!hasAnyPlan && (
        <div className="no-plan-message">
          <p>📅 {isNextWeek ? 'Next week is not planned yet' : 'This week has no planned workouts'}</p>
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
        {weekDays.map((day) => (
          <div 
            key={day.date} 
            className={`day-card read-only ${weekPlan[day.date] ? 'planned' : ''} ${day.isToday ? 'today' : ''}`}
          >
            <div className="day-header">
              <span className="day-name">{day.dayShort}</span>
              <span className="day-number">{day.dayNumber}</span>
            </div>
            
            {weekPlan[day.date] ? (
              <div className="planned-workout">
                {Array.isArray(weekPlan[day.date]) ? (
                  <div className="multiple-workouts">
                    {weekPlan[day.date].map((workout, index) => {
                      const workoutInfo = workoutOptions.find(w => w.key === workout);
                      return (
                        <div key={workout} className="workout-item">
                          <span className="workout-icon">{workoutInfo?.icon}</span>
                          <span className="workout-label">{workoutInfo?.label}</span>
                          {index < weekPlan[day.date].length - 1 && <span className="workout-separator">, </span>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="single-workout">
                    <span className="workout-icon">{workoutOptions.find(w => w.key === weekPlan[day.date])?.icon}</span>
                    <span className="workout-label">{workoutOptions.find(w => w.key === weekPlan[day.date])?.label}</span>
                  </div>
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