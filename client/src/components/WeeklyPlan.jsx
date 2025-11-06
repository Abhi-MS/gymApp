import React from "react";

function WeeklyPlan({ nextWeekPlan = {} }) {
  // Get next week's Monday date as string
  const getNextWeekStart = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 8); // +8 to get next Monday
    return monday.toISOString().split('T')[0];
  };

  // Get days of next week
  const getNextWeekDays = () => {
    const days = [];
    const weekStart = new Date(getNextWeekStart());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push({
        date: day.toISOString().split('T')[0],
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