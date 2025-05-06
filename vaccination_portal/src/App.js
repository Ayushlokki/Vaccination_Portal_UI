
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import Vaccination from './components/Vaccination';
import Reports from './components/Reports';
import NavBar from './components/NavBar';

function App() {
  const [tab, setTab] = useState("Dashboard");

  const handleTabChange = (newTab) => {
    switch (newTab) {
      case "Dashboard":
        setTab("Dashboard");

        break;
      case "Manage Students":
        setTab("Manage Students");

        break;
      case "Vaccination Drives":
        setTab("Vaccination Drives");

        break;
      case "Reports":
        setTab("Reports");

        break;
      default:
        break;
    }
  }
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<NavBar change={handleTabChange} tab={tab}><Dashboard /></NavBar>} />
        <Route path="/manage" element={<NavBar change={handleTabChange} tab={tab}><StudentManagement /></NavBar>} />
        <Route path="/drives" element={<NavBar change={handleTabChange} tab={tab}><Vaccination /></NavBar>} />
        <Route path="/reports" element={<NavBar change={handleTabChange} tab={tab}><Reports /></NavBar>} />
      </Routes>
    </Router>
  );
}

export default App;
