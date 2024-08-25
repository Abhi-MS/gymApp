import { Link } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import muscleGroupsData from "../../jsonFiles/abs.json"

export default function UpperBody() {

  const [data,setData] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const handleMuscleGroupClick = (muscleGroup) => {
    setSelectedMuscleGroup(muscleGroup);
  };

  const selectedImages = data.find(row => row.MuscleGroups === selectedMuscleGroup)?.ListEx || [];

  useEffect(() => {
    setData(muscleGroupsData);
  }, []);

  return (
    <><div className="hometab"><Link to="/home" style={{ textDecoration: 'none', color: "black" }}>Home</Link></div>
    <div className="exercisegroup">
      <div className="exercisetabs">
        <div className="exercisetab"><Link to="/cardio" style={{ textDecoration: 'none', color: "white" }}>Cardio</Link></div>
        <div className="exercisetab"><Link to="/upperbody" style={{ textDecoration: 'none', color: "white" }}>Upper Body</Link></div>
        <div className="activetab"><Link to="/abs" style={{ textDecoration: 'none', color: "white" }}>Abs</Link></div>
        <div className="exercisetab"><Link to="/lowerbody" style={{ textDecoration: 'none', color: "white" }}>Lower Body</Link></div>
      </div>
      <div className="exerciselist">
        {data.length ? (
          <div className="exerciselist">

          {data.map((row, index) => (
              <div className="bodysection" key={index}
              onClick={() => handleMuscleGroupClick(row.MuscleGroups)}>
              {row.MuscleGroups}
              </div>
              ))}

          </div>
        ) : null}
      </div>
      <div className="exercises">
      {selectedImages.length > 0 ? (
          selectedImages.map((url, index) => (
            <div className="workout">
            <img 
              key={index}
              src={url}
              alt={`Exercise ${index + 1}`}
            />
            </div>
          ))
        ) : (
          <p>Select a muscle group to see exercise images.</p>
        )}
        </div>
        </div>
    </>
  );
}