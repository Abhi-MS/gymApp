import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./Header";
import Home from "../pages/Home"
import Login from "../pages/Login"
import NoPage from "../pages/NoPage";
import UpperBody from "../pages/MuscleGroups/UpperBody"
import MuscleGroup from "../pages/MuscleGroups/MuscleGroup";
import Footer from "./Footer";
import "../../src/styles.css"


function App() {
  return (
    <div>
    <Header />
    <Router>
        <Routes>
          <Route index element={<Login/>}/>
          <Route path="/home" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/upperbody" element={<UpperBody />}/>
          <Route path="/:group" element={<MuscleGroup />} />
          <Route path="*" element={<NoPage />}/>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
