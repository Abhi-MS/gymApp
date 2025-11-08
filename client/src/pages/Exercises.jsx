import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function MuscleGroupPage() {
  const { group } = useParams(); 
  const [data, setData] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    exercise: null,
    editValues: {}
  });

  // Define all possible tabs
  const tabs = [
    { path: 'cardio', label: 'Cardio' },
    { path: 'upperbody', label: 'Upper Body' },
    { path: 'abs', label: 'Abs' },
    { path: 'lowerbody', label: 'Lower Body' }
  ];

  const handleMuscleGroupClick = (muscleGroup) => {
    setSelectedMuscleGroup(muscleGroup);
  };

  // Open modal for editing all exercise values
  const openModal = (exercise) => {
    const editValues = {};
    ['weight', 'reps', 'sets', 'duration', 'distance', 'calories'].forEach(field => {
      if (exercise.hasOwnProperty(field)) {
        editValues[field] = exercise[field].toString();
      }
    });
    
    setModalData({ exercise, editValues });
    setShowModal(true);
  };

  // Close modal without saving
  const closeModal = () => {
    setShowModal(false);
    setModalData({ exercise: null, editValues: {} });
  };

  // Update individual field in modal
  const updateModalField = (field, value) => {
    setModalData(prev => ({
      ...prev,
      editValues: { ...prev.editValues, [field]: value }
    }));
  };

  // Save all modal values at once
  const saveAllModalValues = () => {
    const updatedExercise = { ...modalData.exercise };
    
    // Update all fields
    Object.entries(modalData.editValues).forEach(([field, value]) => {
      const numericValue = field === 'distance' 
        ? parseFloat(value) || 0
        : parseInt(value) || 0;
      updatedExercise[field] = Math.max(0, numericValue);
    });

    // Update the data
    const updatedData = data.map(group => ({
      ...group,
      ListEx: group.ListEx.map(item =>
        item.name === modalData.exercise.name ? updatedExercise : item
      )
    }));
    setData(updatedData);

    // Save to workout history
    saveToWorkoutHistory(updatedExercise);
    closeModal();
  };

  // Find the selected muscle group data
  const selectedExercises = data.find(row => row.MuscleGroups === selectedMuscleGroup)?.ListEx || (data[0]?.ListEx || []);

  // Load and save data to localStorage
  useEffect(() => {
    const loadWorkoutData = async () => {
      const storageKey = `workoutData_${group}`;
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
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
          localStorage.setItem(storageKey, JSON.stringify(module.default));
        } catch (error) {
          console.error(`Error loading ${group}.json: `, error);
        }
      }
    };

    if (group) {
      loadWorkoutData();
    }
  }, [group]);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    if (data.length > 0 && group) {
      const storageKey = `workoutData_${group}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, group]);

  // Add body class for exercise page
  useEffect(() => {
    document.body.classList.add('exercise-page');
    return () => {
      document.body.classList.remove('exercise-page');
    };
  }, []);

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
                    
                    {exercise.hasOwnProperty('weight') && (
                      <div className="tracking">
                        <label>Weight (lbs)</label>
                        <div className="update">
                          <span className="clickable-number" onClick={() => openModal(exercise)}>
                            {exercise.weight}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {(exercise.hasOwnProperty('reps') || exercise.hasOwnProperty('sets')) && (
                      <div className="tracking">
                        <div className="update reps-sets-row">
                          {exercise.hasOwnProperty('reps') && (
                            <div className="reps-sets-item">
                              <span className="field-label">Reps:</span>
                              <span className="clickable-number" onClick={() => openModal(exercise)}>
                                {exercise.reps}
                              </span>
                            </div>
                          )}
                          {exercise.hasOwnProperty('sets') && (
                            <div className="reps-sets-item">
                              <span className="field-label">Sets:</span>
                              <span className="clickable-number" onClick={() => openModal(exercise)}>
                                {exercise.sets}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {exercise.hasOwnProperty('duration') && (
                      <div className="tracking">
                        <label>Duration (min)</label>    
                        <div className="update">
                          <span className="clickable-number" onClick={() => openModal(exercise)}>
                            {exercise.duration}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {exercise.hasOwnProperty('distance') && (
                      <div className="tracking">
                        <label>Distance (miles)</label>    
                        <div className="update">
                          <span className="clickable-number" onClick={() => openModal(exercise)}>
                            {exercise.distance.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {exercise.hasOwnProperty('calories') && (
                      <div className="tracking">
                        <label>Calories</label>    
                        <div className="update">
                          <span className="clickable-number" onClick={() => openModal(exercise)}>
                            {exercise.calories}
                          </span>
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

      {/* Exercise Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Exercise</h3>
              <p>{modalData.exercise?.name}</p>
            </div>
            
            <div className="modal-body">
              {modalData.exercise?.hasOwnProperty('weight') && (
                <div className="modal-field">
                  <label>Weight (lbs):</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={modalData.editValues.weight || ''}
                    onChange={(e) => updateModalField('weight', e.target.value)}
                    className="modal-input"
                    placeholder="Enter weight..."
                  />
                </div>
              )}
              
              {modalData.exercise?.hasOwnProperty('reps') && (
                <div className="modal-field">
                  <label>Reps:</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={modalData.editValues.reps || ''}
                    onChange={(e) => updateModalField('reps', e.target.value)}
                    className="modal-input"
                    placeholder="Enter reps..."
                  />
                </div>
              )}
              
              {modalData.exercise?.hasOwnProperty('sets') && (
                <div className="modal-field">
                  <label>Sets:</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={modalData.editValues.sets || ''}
                    onChange={(e) => updateModalField('sets', e.target.value)}
                    className="modal-input"
                    placeholder="Enter sets..."
                  />
                </div>
              )}
              
              {modalData.exercise?.hasOwnProperty('duration') && (
                <div className="modal-field">
                  <label>Duration (minutes):</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={modalData.editValues.duration || ''}
                    onChange={(e) => updateModalField('duration', e.target.value)}
                    className="modal-input"
                    placeholder="Enter duration..."
                  />
                </div>
              )}
              
              {modalData.exercise?.hasOwnProperty('distance') && (
                <div className="modal-field">
                  <label>Distance (miles):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={modalData.editValues.distance || ''}
                    onChange={(e) => updateModalField('distance', e.target.value)}
                    className="modal-input"
                    placeholder="Enter distance..."
                  />
                </div>
              )}
              
              {modalData.exercise?.hasOwnProperty('calories') && (
                <div className="modal-field">
                  <label>Calories:</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={modalData.editValues.calories || ''}
                    onChange={(e) => updateModalField('calories', e.target.value)}
                    className="modal-input"
                    placeholder="Enter calories..."
                  />
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={closeModal}>Cancel</button>
              <button className="modal-btn save" onClick={saveAllModalValues}>Save All</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  function saveToWorkoutHistory(exercise) {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    
    const historyEntry = {
      date: new Date().toISOString(),
      exerciseName: exercise.name,
      category: group,
      ...(exercise.weight !== undefined && { weight: exercise.weight }),
      ...(exercise.reps !== undefined && { reps: exercise.reps }),
      ...(exercise.sets !== undefined && { sets: exercise.sets }),
      ...(exercise.duration !== undefined && { duration: exercise.duration }),
      ...(exercise.distance !== undefined && { distance: exercise.distance }),
      ...(exercise.calories !== undefined && { calories: exercise.calories })
    };

    history.push(historyEntry);
    
    // Keep only last 500 entries
    if (history.length > 500) {
      history.splice(0, history.length - 500);
    }
    
    localStorage.setItem('workoutHistory', JSON.stringify(history));
  }
}
