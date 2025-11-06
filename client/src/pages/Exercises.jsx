import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function MuscleGroupPage() {
  const { group } = useParams(); 
  const [data, setData] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);

  const handleMuscleGroupClick = (muscleGroup) => {
    setSelectedMuscleGroup(muscleGroup);
  };
  // Find the selected muscle group data
  const selectedExercises = data.find(row => row.MuscleGroups === selectedMuscleGroup)?.ListEx || (data[0]?.ListEx || []);

  // Load and save data to localStorage
  useEffect(() => {
    const loadWorkoutData = async () => {
      // TEMPORARY FIX: Always clear cache for upperbody and lowerbody to force fresh load
      const storageKey = `workoutData_${group}`;
      
      if (group === 'upperbody' || group === 'lowerbody') {
        localStorage.removeItem(storageKey);
        console.log(`Cleared localStorage for ${group} to force fresh load`);
      }
      
      const savedData = localStorage.getItem(storageKey);
      
      // Check if we need to force reload due to outdated exercise names
      const hasOldData = savedData && JSON.parse(savedData).length > 0 && 
                         JSON.parse(savedData)[0].ListEx && 
                         JSON.parse(savedData)[0].ListEx[0].name.includes("Exercise");
      
      if (savedData && !hasOldData) {
        // Use saved data from localStorage
        console.log(`Loading ${group} from localStorage:`, JSON.parse(savedData));
        setData(JSON.parse(savedData));
      } else {
        // Load from JSON file if no saved data exists or force reload is needed
        try {
          const module = await import(`../jsonFiles/${group}.json`);
          console.log(`Loading ${group} from JSON file (${module.default.length} groups):`, module.default);
          setData(module.default);
          // Save initial data to localStorage
          localStorage.setItem(storageKey, JSON.stringify(module.default));
          console.log(`Saved fresh ${group} data to localStorage`);
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
      <div className="exercisepage">
        <div className="hometab">
          <Link to="/home" style={{ textDecoration: 'none', color: "black" }}>Home</Link>
          <button 
            onClick={() => {
              // Force clear localStorage and reload
              localStorage.removeItem(`workoutData_${group}`);
              window.location.reload();
            }}
            style={{ marginLeft: '10px', padding: '8px 12px', fontSize: '13px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔄 Load Fresh Exercises
          </button>
          <div style={{ marginTop: '5px', fontSize: '11px', color: '#666' }}>
            Current muscle group: {group} | Loaded exercises: {data.length}
          </div>
        </div>
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
          <div className="exerciselist">
            {data.length ? (
              <div className="exerciselist">
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
                      <p>Weight</p>
                      <div className="update">
                        <button onClick={() => handleUpdate(exercise, 'weight', -1)}>-</button>
                        <p>{exercise.weight}</p>
                        <button onClick={() => handleUpdate(exercise, 'weight', 1)}>+</button>
                      </div>
                    </div>
                    <div className="tracking">
                      <p>Reps</p>    
                      <div className="update">
                        <button onClick={() => handleUpdate(exercise, 'reps', -1)}>-</button>
                        {exercise.reps}
                        <button onClick={() => handleUpdate(exercise, 'reps', 1)}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Select a muscle group to see exercise images.</p>
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
