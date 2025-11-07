import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function MuscleGroupPage() {
  const { group } = useParams(); 
  const [data, setData] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);

  const handleMuscleGroupClick = (muscleGroup) => {
    setSelectedMuscleGroup(muscleGroup);
  };

  // Add body class for exercise page
  useEffect(() => {
    document.body.classList.add('exercise-page');
    return () => {
      document.body.classList.remove('exercise-page');
    };
  }, []);
  // Find the selected muscle group data
  const selectedExercises = data.find(row => row.MuscleGroups === selectedMuscleGroup)?.ListEx || (data[0]?.ListEx || []);

  // Load and save data to localStorage
  useEffect(() => {
    const loadWorkoutData = async () => {
      // TEMPORARY FIX: Always clear cache for upperbody and lowerbody to force fresh load
      const storageKey = `workoutData_${group}`;
      
      if (group === 'upperbody' || group === 'lowerbody') {
        localStorage.removeItem(storageKey);
      }
      
      const savedData = localStorage.getItem(storageKey);
      
      // Check if we need to force reload due to outdated exercise names
      const hasOldData = savedData && JSON.parse(savedData).length > 0 && 
                         JSON.parse(savedData)[0].ListEx && 
                         JSON.parse(savedData)[0].ListEx[0].name.includes("Exercise");
      
      if (savedData && !hasOldData) {
        // Use saved data from localStorage
        setData(JSON.parse(savedData));
      } else {
        // Load from JSON file if no saved data exists or force reload is needed
        try {
          // Map tab names to actual file names
          const fileNameMap = {
            'upperbody': 'upperBody',
            'lowerbody': 'lowerBody',
            'cardio': 'cardio',
            'abs': 'abs'
          };
          
          const fileName = fileNameMap[group] || group;
          const module = await import(`../jsonFiles/${fileName}.json`);
          setData(module.default);
          // Save initial data to localStorage
          localStorage.setItem(storageKey, JSON.stringify(module.default));
        } catch (error) {
          console.error(`Error loading ${group}.json: `, error);
        }
      }
    };

    if (group) {
      loadWorkoutData();
    }
  }, [group]); // Re-run when 'group' changes

  // Save data to localStorage whenever data changes
  useEffect(() => {
    if (data.length > 0 && group) {
      const storageKey = `workoutData_${group}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, group]); // Save whenever data changes

  // Define all possible tabs
  const tabs = [
    { path: 'cardio', label: 'Cardio' },
    { path: 'upperbody', label: 'Upper Body' },
    { path: 'abs', label: 'Abs' },
    { path: 'lowerbody', label: 'Lower Body' }
  ];

  return (
    <>
      <Link to="/home" className="back-button">← Home</Link>
      <div className="exercisepage">
        <div className="exercisegroup">
          <div className="exercisetabs">
            {tabs.map((tab) => (
              <div
                key={tab.path}
                className={`exercisetab ${group === tab.path ? 'activetab' : ''}`}
              >
                <Link to={`/${tab.path}`} style={{ textDecoration: 'none', color: "white" }}>
                  {tab.label}
                </Link>
              </div>
            ))}
          </div>
          <div className="exerciselist" >
            {data.length ? (
              <div className="exerciselist" style={{ padding: '1rem' }}>
                {data.map((row, index) => (
                  <div
                    className="bodysection"
                    key={index}
                    onClick={() => handleMuscleGroupClick(row.MuscleGroups)}
                  >
                    {row.MuscleGroups}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="exercises">
            {selectedExercises.length > 0 ? (
              selectedExercises.map((exercise, index) => (
                <div className="workout" key={index}>
                  <div className="exercise-img">
                    <img src={exercise.url} alt={exercise.name} />
                  </div>
                  <div className="exercise-info">
                    <p id="exercise-name">{exercise.name}</p>
                    <div className="tracking">
                      <label>Weight (lbs)</label>
                      <div className="update">
                        <button 
                          className="update-btn decrease"
                          onClick={() => handleUpdate(exercise, 'weight', -1)}
                          disabled={exercise.weight <= 0}
                        >
                          −
                        </button>
                        <span className="value">{exercise.weight}</span>
                        <button 
                          className="update-btn increase"
                          onClick={() => handleUpdate(exercise, 'weight', 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="tracking">
                      <label>Reps</label>    
                      <div className="update">
                        <button 
                          className="update-btn decrease"
                          onClick={() => handleUpdate(exercise, 'reps', -1)}
                          disabled={exercise.reps <= 0}
                        >
                          −
                        </button>
                        <span className="value">{exercise.reps}</span>
                        <button 
                          className="update-btn increase"
                          onClick={() => handleUpdate(exercise, 'reps', 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-selection">
                <div className="no-selection-icon">💪</div>
                <h3>Choose a Muscle Group</h3>
                <p>Select a muscle group from the left panel to view exercises and start your workout!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  function handleUpdate(exercise, field, change) {
    const updatedData = data.map(group => ({
      ...group,
      ListEx: group.ListEx.map(item =>
        item.name === exercise.name
          ? { ...item, [field]: Math.max(0, item[field] + change) } // Prevent negative values
          : item
      )
    }));
    setData(updatedData);
  }
}
