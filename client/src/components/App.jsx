import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./Header";
import Home from "../pages/Home"
import Login from "../pages/Login"
import NoPage from "../pages/NoPage";
import Exercises from "../pages/Exercises";
import Footer from "./Footer";
import "../../src/styles.css"


function App() {
  return (
    <div>
    <Header />
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/:group" element={<Exercises />} />
          <Route path="*" element={<NoPage />}/>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
