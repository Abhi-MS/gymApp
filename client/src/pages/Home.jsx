import React from "react";
import Group from "../components/Group";
import { Link } from "react-router-dom";
import CalendarComponent from "../components/Calendar";



export default function Home() {
  return (
    <>
    <div className="home">
    <div className="groups">
    <Link to="/cardio" style={{ textDecoration: 'none'}}>
        <Group name="Cardio"/>
    </Link>
    <Link to="/upperbody" style={{ textDecoration: 'none'}}>
      <Group name="Upper body"/>
    </Link>
    <Link to="/lowerbody" style={{ textDecoration: 'none'}}>
      <Group name="Lower body"/>
    </Link>
    <Link to="/abs" style={{ textDecoration: 'none'}}>
      <Group name="Abs" />
    </Link>
    </div>
    <div style={{ textAlign: 'center', margin: '10px 0' }}>
      <button 
        onClick={() => {
          if (window.confirm('This will reset ALL workout progress and reload fresh exercises for all muscle groups. Continue?')) {
            // Clear all workout data
            ['cardio', 'upperbody', 'lowerbody', 'abs'].forEach(group => {
              localStorage.removeItem(`workoutData_${group}`);
            });
            // Clear calendar events
            localStorage.removeItem('workoutCalendarEvents');
            window.location.reload();
          }
        }}
        style={{ 
          padding: '8px 12px', 
          fontSize: '14px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}
      >
        🗑️ Reset All Data & Reload Fresh
      </button>
    </div>
    <div className="calendar"><CalendarComponent /></div>
    </div>
    
    </>
  );
}