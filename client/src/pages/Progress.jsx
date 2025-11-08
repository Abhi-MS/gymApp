import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Progress() {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [availableExercises, setAvailableExercises] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    // Load workout history from localStorage
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    setWorkoutHistory(history);

    // Get unique exercises for the filter dropdown
    const exercises = [...new Set(history.map(entry => entry.exerciseName))];
    setAvailableExercises(exercises.sort());
  }, []);

  useEffect(() => {
    // Filter history based on selected exercise
    if (selectedExercise) {
      const filtered = workoutHistory.filter(entry => entry.exerciseName === selectedExercise);
      setFilteredHistory(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else {
      setFilteredHistory(workoutHistory.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  }, [selectedExercise, workoutHistory]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressTrend = (exerciseName) => {
    const exerciseHistory = workoutHistory
      .filter(entry => entry.exerciseName === exerciseName)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (exerciseHistory.length < 2) return null;
    
    const first = exerciseHistory[0];
    const last = exerciseHistory[exerciseHistory.length - 1];
    
    const trends = {};
    ['weight', 'reps', 'sets', 'duration', 'distance', 'calories'].forEach(field => {
      if (first[field] !== undefined && last[field] !== undefined) {
        const change = last[field] - first[field];
        if (change > 0) trends[field] = `+${change}`;
        else if (change < 0) trends[field] = `${change}`;
      }
    });
    
    return trends;
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all workout history? This cannot be undone.')) {
      localStorage.removeItem('workoutHistory');
      setWorkoutHistory([]);
      setFilteredHistory([]);
      setAvailableExercises([]);
      setSelectedExercise('');
    }
  };

  return (
    <>
      <Link to="/home" className="back-button">← Home</Link>
      <div className="progress-page">
        <div className="progress-header">
          <h1>Your Progress</h1>
          <p>Track your workout history and see your improvements over time</p>
        </div>

        <div className="progress-controls">
          <div className="exercise-filter">
            <label htmlFor="exercise-select">Filter by Exercise:</label>
            <select 
              id="exercise-select"
              value={selectedExercise} 
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              <option value="">All Exercises</option>
              {availableExercises.map(exercise => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
          </div>
          <button onClick={clearHistory} className="clear-history-btn">
            Clear History
          </button>
        </div>

        {selectedExercise && (
          <div className="progress-summary">
            <h3>Progress Summary for {selectedExercise}</h3>
            <div className="trend-indicators">
              {(() => {
                const trends = getProgressTrend(selectedExercise);
                if (!trends) return <p>Not enough data to show trends</p>;
                
                return Object.entries(trends).map(([field, change]) => (
                  <div key={field} className="trend-item">
                    <span className="trend-field">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                    <span className={`trend-value ${change.startsWith('+') ? 'positive' : 'negative'}`}>
                      {change}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        <div className="history-container">
          <h3>Workout History ({filteredHistory.length} entries)</h3>
          
          {filteredHistory.length === 0 ? (
            <div className="no-history">
              <div className="no-history-icon">📊</div>
              <h3>No History Yet</h3>
              <p>Start tracking your workouts to see your progress here!</p>
            </div>
          ) : (
            <div className="history-list">
              {filteredHistory.map((entry, index) => (
                <div key={index} className="history-entry">
                  <div className="entry-header">
                    <h4>{entry.exerciseName}</h4>
                    <span className="entry-date">{formatDate(entry.date)}</span>
                  </div>
                  <div className="entry-details">
                    <div className="entry-category">
                      <span className="category-badge">{entry.category}</span>
                    </div>
                    <div className="entry-values">
                      {entry.weight !== undefined && (
                        <span className="value">Weight: {entry.weight} lbs</span>
                      )}
                      {entry.reps !== undefined && (
                        <span className="value">Reps: {entry.reps}</span>
                      )}
                      {entry.sets !== undefined && (
                        <span className="value">Sets: {entry.sets}</span>
                      )}
                      {entry.duration !== undefined && (
                        <span className="value">Duration: {entry.duration} min</span>
                      )}
                      {entry.distance !== undefined && (
                        <span className="value">Distance: {entry.distance} miles</span>
                      )}
                      {entry.calories !== undefined && (
                        <span className="value">Calories: {entry.calories}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}