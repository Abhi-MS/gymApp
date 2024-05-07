import { Link} from "react-router-dom";
import React from "react";

export default function Abs() {
  return (
  <><div className="hometab"><Link to="/home" style={{ textDecoration: 'none', color: "black" }}>Home</Link></div>
    <div className="exercisegroup">
      <div className="exercisetabs">
        <div className="exercisetab"><Link to="/cardio" style={{ textDecoration: 'none', color:"white"}}>Cardio</Link></div>
        <div className="exercisetab"><Link to="/upperbody" style={{ textDecoration: 'none', color:"white"}}>Upper Body</Link></div>
        <div className="activetab"><Link to="/abs" style={{ textDecoration: 'none', color:"white"}}>Abs</Link></div>
        <div className="exercisetab"><Link to="/lowerbody" style={{ textDecoration: 'none', color:"white"}}>Lower Body</Link></div>
      </div>
      <div className="exerciselist">
        <div className="bodysection">Upper</div>
        <div className="bodysection">Lower</div>
        <div className="bodysection">Obliques</div>
        <div className="bodysection">Combine</div>
        <div className="bodysection">Weighted</div>
      </div>
      <div className="exercises"></div>
    </div></>
  );
}