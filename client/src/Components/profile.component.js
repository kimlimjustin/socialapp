import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ProfilePicturePNG from "../Icons/profile.png"
import cookie from "react-cookies";

const user_available = async (username) => {
    var available = false
    await Axios.get("http://localhost:5000/users")
    .then(res => {
        (res.data).forEach((i) => {
            if(i.username.toLowerCase() === username) available = true
        })
    })
    return available
}

const Profile = (props) => {
    const [username, setUsername] = useState('');
    //const [userInfo, setInfo] = useState({});
    const [available, setAvailable] = useState(false);
    const [ProfilePicture, setProfilePicture] = useState(ProfilePicturePNG);
    const [isOwner, SetIsOwner] = useState(false);

    useEffect(()=> {
        if(!props.match.params.username) window.location = "/";
        setUsername(props.match.params.username);
        user_available(username).then(result => setAvailable(result));
        if(available){
            Axios.get("http://localhost:5000/users")
            .then(res => {
                (res.data).forEach((i)=> {
                    if(i.username.toLowerCase() === username){ 
                        const token = cookie.load('token');
                        if(i.profile_picture) setProfilePicture("http://localhost:5000/"+i.profile_picture.filename);
                        if(i.token === token) SetIsOwner(true);
                    }
                })
                //setInfo(res.data[0]);
            })
        }
    }, [props.match.params.username, username, available])
    
    return(
        <div className="container margin">
            {!available? <h1 className="box-title">Sorry, this page is unavailable, please<Link to="/" className="link"> go back</Link></h1>:
            <div className="row">
                <div className="profile-pp">
                    <NavLink to="/setting/profile-picture"><img src={ProfilePicture} alt="Profile" className="profile-picture-img" /></NavLink>
                </div>
                <div className="profile-info">
                    <h2 className="profile-heading">{username} {isOwner?<NavLink to="/setting/profile/"><button className="btn btn-dark">Edit Profile</button></NavLink>: null}</h2>
                </div>
            </div>
            }
        </div>
    )
}

export default Profile;