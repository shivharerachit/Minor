import React from "react";
import { NavLink } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "./Navbar.css" ;

const Navbar = () => {
    return (
        <div className="navbar">
            {/* <img src="" alt="" /> */}
            <h3>AutoValuator</h3>
            <div className="menu">
            <NavLink className={({ isActive }) => (isActive ? "active_class" : "")} to="/">Home</NavLink>
            <NavLink className={({ isActive }) => (isActive ? "active_class" : "")} to="/predictprice">Predict Price</NavLink>
            </div>
            <button type="button" className="btn btn-outline-primary">Contact Us</button>
          
        </div>
    );
};

export default Navbar;
