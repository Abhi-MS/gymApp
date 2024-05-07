import React from "react";
import { Route, Link, useParams } from 'react-router-dom';

function Group(props) {
  return (
    <div className="group">
      <h1>{props.name}</h1>
    </div>
  );
}

export default Group;
