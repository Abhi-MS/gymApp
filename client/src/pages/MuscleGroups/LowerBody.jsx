import { Link } from "react-router-dom";
import React from "react";

export default function LowerBody() {
  return (
    <><div className="hometab"><Link to="/home" style={{ textDecoration: 'none', color: "black" }}>Home</Link></div>
    <div className="exercisegroup">
      <div className="exercisetabs">
        <div className="exercisetab"><Link to="/cardio" style={{ textDecoration: 'none', color: "white" }}>Cardio</Link></div>
        <div className="exercisetab"><Link to="/upperbody" style={{ textDecoration: 'none', color: "white" }}>Upper Body</Link></div>
        <div className="exercisetab"><Link to="/abs" style={{ textDecoration: 'none', color: "white" }}>Abs</Link></div>
        <div className="activetab"><Link to="/lowerbody" style={{ textDecoration: 'none', color: "white" }}>Lower Body</Link></div>
      </div>
      <div className="exerciselist">
        <div className="bodysection">Squats</div>
        <div className="bodysection">Quads</div>
        <div className="bodysection">Hamstrings</div>
        <div className="bodysection">Glutes</div>
        <div className="bodysection">Calves</div>
        <div className="bodysection">Combine</div>
      </div>
      <div className="exercises"></div>
    </div></>
  );
}