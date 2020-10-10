import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import profileLogo from "../Icons/profile.png";
import cookie from "react-cookies";
import axios from "axios";

const Navbar = () => {
    const [PP, setPP] = useState(null);
    const [username, setUsername] = useState('');
    useEffect(()=> {
        const token = cookie.load('token');
        axios.get('http://localhost:5000/users')
        .then(res => {
            (res.data).forEach(i => {
                if(i.token === token){
                    setUsername(i.username);
                    if(i.profile_picture) setPP("http://localhost:5000/" + i.profile_picture.filename)
                } 
            })
        })
    })
    return(
        <nav className="navbar nav-effect bg-white text-dark">
            <div className="container">
                <Link to= "/"  className="nav-logo">SocialApp</Link>
                <span id="nav-icon" className="nav-icon" data-target ="nav-list">&#x2630;</span>
                <ul className="nav-list" id="nav-list">
                    {PP === null 
                    ?<NavLink to={`/u/${username}`}><li className="nav-item"><img src={profileLogo} alt="Profile Logo"  className="logo" /><span className="nav-item-description">Profile</span></li></NavLink>
                    :<NavLink to={`/u/${username}`}><li className="nav-item"><img src={PP} alt="Profile Logo"  className="logo" /><span className="nav-item-description">Profile</span></li></NavLink>}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;