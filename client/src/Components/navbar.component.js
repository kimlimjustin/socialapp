import React from "react";
import { Link } from "react-router-dom";
import profileLogo from "../Icons/profile.png";

const Navbar = () => {
    return(
        <nav className="navbar bg-light text-dark">
            <div className="container">
            <Link to= "/"  className="nav-logo">SocialApp</Link>
            <span id="nav-icon" className="nav-icon" data-target ="nav-list">&#x2630;</span>
            <ul className="nav-list" id="nav-list">
                <li className="nav-item"><img src={profileLogo} alt="Profile Logo"  className="logo" /></li>
            </ul>
            </div>
        </nav>
    )
}

export default Navbar;