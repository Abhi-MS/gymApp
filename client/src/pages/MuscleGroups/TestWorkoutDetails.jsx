import { Link } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import Data from "../../csvfiles/upperbody.csv"
import Papa from 'papaparse';
import { useParams } from 'react-router-dom';

const TestWorkoutDetails = () => {

  const [data,setData] = useState([]);

  useEffect(() =>{
    const fetchData = async () => {
      const response = await fetch(Data);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData,{
        header:true,
        skipEmptyLines:true
      }).data;
      setData(parsedData);
    };
    fetchData();
  }, [])

  return (
    <><div className="hometab"><Link to="/home" style={{ textDecoration: 'none', color: "black" }}>Home</Link></div>
    <div className="exercisegroup">
      <div className="exercisetabs">
        <div className="exercisetab"><Link to="/cardio" style={{ textDecoration: 'none', color: "white" }}>Cardio</Link></div>
        <div className="activetab"><Link to="/upperbody" style={{ textDecoration: 'none', color: "white" }}>Upper Body</Link></div>
        <div className="exercisetab"><Link to="/abs" style={{ textDecoration: 'none', color: "white" }}>Abs</Link></div>
        <div className="exercisetab"><Link to="/lowerbody" style={{ textDecoration: 'none', color: "white" }}>Lower Body</Link></div>
      </div>
      <div className="exerciselist">
        {data.length ? (
          <div className="exerciselist">

            {data.map((row, index) => (
              <div className="bodysection" key={index}>{row.MuscleGroups}</div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="exercises">
        <div className="workout"><img src="https://cdn-cccio.nitrocdn.com/sQAAylIpwgMYZgBLSXcMgCkUIbfIzHvb/assets/images/optimized/rev-3d9de4c/www.aleanlife.com/wp-content/uploads/2020/08/rope-bicep-curls.gif" alt="arms workout 1"></img></div>
        <div className="workout"><img src="https://www.inspireusafoundation.org/wp-content/uploads/2022/10/close-grip-barbell-curl.gif" alt="arms workout 2"/></div>
        <div className="workout"><img src="https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif" alt="arms workout 3"/></div>
        <div className="workout"><img src="https://www.inspireusafoundation.org/wp-content/uploads/2022/04/dumbbell-hammer-curl.gif" alt="arms workout 4"/></div>
      </div>
    </div></>
  );
}

export default TestWorkoutDetails;