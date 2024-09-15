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


  useEffect(() => {
    // Dynamically import the JSON file based on the route parameter
    import(`../jsonFiles/${group}.json`)
      .then(module => setData(module.default))
      .catch(error => console.error(`Error loading ${group}.json: `, error));
  }, [group]); // Re-run when 'group' changes

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
    setData(data.map(group => ({
      ...group,
      ListEx: group.ListEx.map(item =>
        item.name === exercise.name
          ? { ...item, [field]: item[field] + change }
          : item
      )
    })));
  }
}
