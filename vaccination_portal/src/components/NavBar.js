import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({change,tab,children}) => {
    
    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container">
        
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className={`nav-item  ${tab === "Dashboard" ? "fw-bold" : ""}`} onClick={()=>change("Dashboard")}>
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className={`nav-item ${tab === "Manage Students" ? "fw-bold" : ""}`} onClick={()=>change("Manage Students")}>
                  <Link className="nav-link" to="/manage">Manage Students</Link>
                </li>
                <li className={`nav-item ${tab === "Vaccination Drives" ? "fw-bold" : ""}`} onClick={()=>change("Vaccination Drives")}>
                  <Link className="nav-link" to="/drives">Vaccination Drives</Link>
                </li>
                <li className={`nav-item ${tab === "Reports" ? "fw-bold" : ""}`} onClick={()=>change("Reports")}>
                  <Link className="nav-link" to="/reports">Reports</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div>{children}</div>
        </>
      );
    }   
    export default NavBar;
// import React from "react";