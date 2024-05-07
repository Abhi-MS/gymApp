import React from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
  let navigate = useNavigate();
  return (

    <div className="login">
      <h1>Login</h1>
      <input type="text" placeholder="Username"></input>
      <input type="text" placeholder="Password"></input>
      <button className="btn "onClick={()=> {navigate("/home")}}>
        Login
        </button>
    </div>
  );
}