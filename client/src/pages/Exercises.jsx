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
      // TEMPORARY FIX: Always clear cache to force fresh load with new structure
      const storageKey = `workoutData_${group}`;
      localStorage.removeItem(storageKey);
      
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        // Use saved data from localStorage
        setData(JSON.parse(savedData));
      } else {
        // Load from JSON file if no saved data exists
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
                    
                    {/* Show weight field only if exercise has weight property */}
                    {exercise.hasOwnProperty('weight') && (
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
                    )}
                    
                    {/* Show reps field for strength/bodyweight exercises */}
                    {exercise.hasOwnProperty('reps') && (
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
                    )}
                    
                    {/* Show sets field for strength/bodyweight exercises */}
                    {exercise.hasOwnProperty('sets') && (
                      <div className="tracking">
                        <label>Sets</label>    
                        <div className="update">
                          <button 
                            className="update-btn decrease"
                            onClick={() => handleUpdate(exercise, 'sets', -1)}
                            disabled={exercise.sets <= 0}
                          >
                            −
                          </button>
                          <span className="value">{exercise.sets}</span>
                          <button 
                            className="update-btn increase"
                            onClick={() => handleUpdate(exercise, 'sets', 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Show duration field for cardio exercises */}
                    {exercise.hasOwnProperty('duration') && (
                      <div className="tracking">
                        <label>Duration (min)</label>    
                        <div className="update">
                          <button 
                            className="update-btn decrease"
                            onClick={() => handleUpdate(exercise, 'duration', -1)}
                            disabled={exercise.duration <= 0}
                          >
                            −
                          </button>
                          <span className="value">{exercise.duration}</span>
                          <button 
                            className="update-btn increase"
                            onClick={() => handleUpdate(exercise, 'duration', 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Show distance field for cardio exercises */}
                    {exercise.hasOwnProperty('distance') && (
                      <div className="tracking">
                        <label>Distance (miles)</label>    
                        <div className="update">
                          <button 
                            className="update-btn decrease"
                            onClick={() => handleUpdate(exercise, 'distance', -0.1)}
                            disabled={exercise.distance <= 0}
                          >
                            −
                          </button>
                          <span className="value">{exercise.distance.toFixed(1)}</span>
                          <button 
                            className="update-btn increase"
                            onClick={() => handleUpdate(exercise, 'distance', 0.1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Show calories field for cardio exercises */}
                    {exercise.hasOwnProperty('calories') && (
                      <div className="tracking">
                        <label>Calories</label>    
                        <div className="update">
                          <button 
                            className="update-btn decrease"
                            onClick={() => handleUpdate(exercise, 'calories', -10)}
                            disabled={exercise.calories <= 0}
                          >
                            −
                          </button>
                          <span className="value">{exercise.calories}</span>
                          <button 
                            className="update-btn increase"
                            onClick={() => handleUpdate(exercise, 'calories', 10)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
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
          ? { 
              ...item, 
              [field]: field === 'distance' 
                ? Math.max(0, Number((item[field] + change).toFixed(1)))
                : Math.max(0, item[field] + change)
            }
          : item
      )
    }));
    setData(updatedData);
  }
}
