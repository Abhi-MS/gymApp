import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./Header";
import Home from "../pages/Home"
import Login from "../pages/Login"
import NoPage from "../pages/NoPage";
import Cardio from "../pages/MuscleGroups/Cardio";
import UpperBody from "../pages/MuscleGroups/UpperBody"
import LowerBody from "../pages/MuscleGroups/LowerBody"
import Abs from "../pages/MuscleGroups/Abs"
import Footer from "./Footer";
import TestWorkoutDetails from "../pages/MuscleGroups/TestWorkoutDetails";


function App() {
  return (
    <div>
    <Header />
    <Router>
        <Routes>
          <Route index element={<Login/>}/>
          <Route path="/home" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/cardio" element={<Cardio />}/>
          <Route path="/upperbody" element={<UpperBody />}/>
          <Route path="/lowerbody" element={<LowerBody />}/>
          <Route path="/testworkoutdetails/:id" element={<TestWorkoutDetails />}/>
          <Route path="/abs" element={<Abs />}/>
          <Route path="*" element={<NoPage />}/>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
