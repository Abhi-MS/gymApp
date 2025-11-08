import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Progress() {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [availableExercises, setAvailableExercises] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('weight'); // weight, reps, sets, duration, etc.

  // Add body class for styling
  useEffect(() => {
    document.body.classList.add('progress-page');
    return () => {
      document.body.classList.remove('progress-page');
    };
  }, []);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    setWorkoutHistory(history);
    const exercises = [...new Set(history.map(entry => entry.exerciseName))];
    setAvailableExercises(exercises.sort());
  }, []);

  useEffect(() => {
    if (selectedExercise && workoutHistory.length > 0) {
      const exerciseData = workoutHistory
        .filter(entry => entry.exerciseName === selectedExercise)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setChartData(exerciseData);
    } else {
      setChartData([]);
    }
  }, [selectedExercise, workoutHistory]);

  // Separate useEffect to handle chart type auto-selection
  useEffect(() => {
    if (chartData.length > 0) {
      const firstEntry = chartData[0];
      const availableMetrics = [];
      
      if (firstEntry.weight !== undefined) availableMetrics.push('weight');
      if (firstEntry.reps !== undefined) availableMetrics.push('reps');
      if (firstEntry.sets !== undefined) availableMetrics.push('sets');
      if (firstEntry.duration !== undefined) availableMetrics.push('duration');
      if (firstEntry.distance !== undefined) availableMetrics.push('distance');
      if (firstEntry.calories !== undefined) availableMetrics.push('calories');
      
      // If current chartType is not available, switch to first available metric
      if (availableMetrics.length > 0 && !availableMetrics.includes(chartType)) {
        setChartType(availableMetrics[0]);
      }
    }
  }, [chartData, chartType]);

  const formatTooltipData = (entry) => {
    const tooltipData = [];
    
    if (entry.weight !== undefined) tooltipData.push(`Weight: ${entry.weight} lbs`);
    if (entry.reps !== undefined) tooltipData.push(`Reps: ${entry.reps}`);
    if (entry.sets !== undefined) tooltipData.push(`Sets: ${entry.sets}`);
    if (entry.duration !== undefined) tooltipData.push(`Duration: ${entry.duration} min`);
    if (entry.distance !== undefined) tooltipData.push(`Distance: ${entry.distance} miles`);
    if (entry.calories !== undefined) tooltipData.push(`Calories: ${entry.calories}`);
    
    return tooltipData;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getChartMaxValue = () => {
    if (chartData.length === 0) return 100;
    const values = chartData.map(entry => entry[chartType] || 0);
    return Math.max(...values) * 1.2; // Add 20% padding
  };

  const getProgressPercentage = (value, maxValue) => {
    return Math.max(5, (value / maxValue) * 100); // Minimum 5% for visibility
  };

  const getAvailableMetrics = () => {
    if (chartData.length === 0) return [];
    const firstEntry = chartData[0];
    const metrics = [];
    
    if (firstEntry.weight !== undefined) metrics.push({ key: 'weight', label: 'Weight (lbs)', color: '#667eea' });
    if (firstEntry.reps !== undefined) metrics.push({ key: 'reps', label: 'Reps', color: '#764ba2' });
    if (firstEntry.sets !== undefined) metrics.push({ key: 'sets', label: 'Sets', color: '#f093fb' });
    if (firstEntry.duration !== undefined) metrics.push({ key: 'duration', label: 'Duration (min)', color: '#4facfe' });
    if (firstEntry.distance !== undefined) metrics.push({ key: 'distance', label: 'Distance (miles)', color: '#43e97b' });
    if (firstEntry.calories !== undefined) metrics.push({ key: 'calories', label: 'Calories', color: '#fa709a' });
    
    return metrics;
  };

  const getCurrentMetric = () => {
    const metrics = getAvailableMetrics();
    return metrics.find(m => m.key === chartType) || metrics[0];
  };

  const getProgressStats = () => {
    if (chartData.length < 2) return null;
    
    const firstValue = chartData[0][chartType] || 0;
    const lastValue = chartData[chartData.length - 1][chartType] || 0;
    const change = lastValue - firstValue;
    const percentChange = firstValue > 0 ? ((change / firstValue) * 100).toFixed(1) : 0;
    
    return {
      start: firstValue,
      current: lastValue,
      change: change,
      percentChange: percentChange,
      sessions: chartData.length
    };
  };

  return (
    <>
      <Link to="/home" className="back-button">← Home</Link>
      <div className="progress-page">
        <div className="progress-header">
          <h1>💪 Progress Tracker</h1>
          <p>Visualize your fitness journey with interactive charts</p>
        </div>

        <div className="progress-controls">
          <div className="exercise-selector">
            <label>Exercise:</label>
            <select 
              value={selectedExercise} 
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="exercise-dropdown"
            >
              <option value="">Select an exercise...</option>
              {availableExercises.map(exercise => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
          </div>

          {getAvailableMetrics().length > 0 && (
            <div className="metric-selector">
              <label>Metric:</label>
              <div className="metric-tabs">
                {getAvailableMetrics().map(metric => (
                  <button
                    key={metric.key}
                    className={`metric-tab ${chartType === metric.key ? 'active' : ''}`}
                    onClick={() => setChartType(metric.key)}
                    style={{ '--tab-color': metric.color }}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedExercise && chartData.length > 0 && (
          <>
            {/* Progress Stats Summary */}
            {(() => {
              const stats = getProgressStats();
              const currentMetric = getCurrentMetric();
              
              if (!stats || !currentMetric) return null;
              
              return (
                <div className="progress-stats">
                  <div className="stat-card">
                    <div className="stat-value">{stats.start}</div>
                    <div className="stat-label">Starting</div>
                  </div>
                  <div className="stat-card highlight">
                    <div className="stat-value">{stats.current}</div>
                    <div className="stat-label">Current</div>
                  </div>
                  <div className="stat-card">
                    <div className={`stat-value ${stats.change >= 0 ? 'positive' : 'negative'}`}>
                      {stats.change >= 0 ? '+' : ''}{stats.change}
                    </div>
                    <div className="stat-label">Change</div>
                  </div>
                  <div className="stat-card">
                    <div className={`stat-value ${stats.percentChange >= 0 ? 'positive' : 'negative'}`}>
                      {stats.percentChange >= 0 ? '+' : ''}{stats.percentChange}%
                    </div>
                    <div className="stat-label">Growth</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{stats.sessions}</div>
                    <div className="stat-label">Sessions</div>
                  </div>
                </div>
              );
            })()}

            {/* Interactive Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <h3>{selectedExercise} - {getCurrentMetric()?.label}</h3>
                <div className="chart-legend">
                  <div className="legend-item" style={{ '--color': getCurrentMetric()?.color }}>
                    {getCurrentMetric()?.label}
                  </div>
                </div>
              </div>
              
              <div className="chart-area">
                <div className="chart-y-axis">
                  {[100, 75, 50, 25, 0].map(percent => (
                    <div key={percent} className="y-axis-label">
                      {Math.round((getChartMaxValue() * percent) / 100)}
                    </div>
                  ))}
                </div>
                
                <div className="chart-content">
                  <div className="chart-grid">
                    {[0, 25, 50, 75, 100].map(line => (
                      <div key={line} className="grid-line" style={{ bottom: `${line}%` }}></div>
                    ))}
                  </div>
                  
                  <div className="chart-bars">
                    {chartData.map((entry, index) => {
                      const value = entry[chartType] || 0;
                      const height = getProgressPercentage(value, getChartMaxValue());
                      const isLatest = index === chartData.length - 1;
                      const tooltipData = formatTooltipData(entry);
                      
                      return (
                        <div key={index} className="chart-bar-container">
                          <div 
                            className={`chart-bar ${isLatest ? 'latest' : ''}`}
                            style={{ 
                              height: `${height}%`,
                              backgroundColor: getCurrentMetric()?.color,
                              '--glow-color': getCurrentMetric()?.color
                            }}
                            data-tooltip={`${formatDate(entry.date)}\n${tooltipData.join('\n')}`}
                          >
                            <div className="bar-value">{value}</div>
                            <div className="chart-tooltip">
                              <div className="tooltip-date">{formatDate(entry.date)}</div>
                              <div className="tooltip-metrics">
                                {tooltipData.map((metric, idx) => (
                                  <div key={idx} className={`tooltip-metric ${metric.toLowerCase().includes(chartType) ? 'highlighted' : ''}`}>
                                    {metric}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="bar-label">{formatDate(entry.date)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedExercise && chartData.length === 0 && (
          <div className="no-data">
            <div className="no-data-icon">📈</div>
            <h3>No Data Available</h3>
            <p>No workout data found for {selectedExercise}. Start tracking to see your progress!</p>
          </div>
        )}

        {!selectedExercise && (
          <div className="select-exercise">
            <div className="select-icon">🏋️‍♂️</div>
            <h3>Select an Exercise</h3>
            <p>Choose an exercise from the dropdown above to view your progress charts and statistics.</p>
            {availableExercises.length === 0 && (
              <div className="no-exercises">
                <p><strong>No exercises tracked yet!</strong></p>
                <p>Complete some workouts to start seeing your progress here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}