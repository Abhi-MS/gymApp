import { Link } from "react-router-dom";
import React from "react";

export default function Cardio() {
  return (
    <><div className="hometab"><Link to="/home" style={{ textDecoration: 'none', color: "black" }}>Home</Link></div>
    <div className="exercisegroup">
      <div className="exercisetabs">
        <div className="activetab"><Link to="/cardio" style={{ textDecoration: 'none', color: "white" }}>Cardio</Link></div>
        <div className="exercisetab"><Link to="/upperbody" style={{ textDecoration: 'none', color: "white" }}>Upper Body</Link></div>
        <div className="exercisetab"><Link to="/abs" style={{ textDecoration: 'none', color: "white" }}>Abs</Link></div>
        <div className="exercisetab"><Link to="/lowerbody" style={{ textDecoration: 'none', color: "white" }}>Lower Body</Link></div>
      </div>
      <div className="exerciselist">
        <div className="bodysection">Treadmill</div>
        <div className="bodysection">Running</div>
        <div className="bodysection">Swimming</div>
        <div className="bodysection">Cycling</div>
        <div className="bodysection">Rowing</div>
        <div className="bodysection">Walking</div>
      </div>
      <div className="exercises"></div>
    </div></>
  );
}