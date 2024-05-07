import React from "react";
import Group from "../components/Group";
import { Link } from "react-router-dom";



export default function Home() {
  return (
    <>
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
    <Link to="/testworkoutdetails/upperbody">
    <Group name="Upper body"/>
    </Link>
    </div>
    </>
  );
}