import axios from "axios";
import React, { useState, useEffect } from "react";
import profile from "../Icons/profile.png";
import cookie from 'react-cookies';
import { Link } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const token = cookie.load('token');
async function check_token() {
    var logged_in = false
    await axios.get(`${BACKEND_URL}/users`)
        .then(res => {
            (res.data).forEach(i => {
                if (i.token === token) {
                    logged_in = true
                    return true
                }
            })
        })
        .catch(err => console.log(err));
    return logged_in
}

const PP = () => {
    const [file, setFile] = useState(null);
    const [info, setInfo] = useState('');

    useEffect(() => {
        check_token().then(result => {
            if (result) {
                axios.get(`${BACKEND_URL}/users`)
                    .then(res => {
                        (res.data).forEach(i => {
                            if (i.token === token) {
                                if (i.profile_picture) setFile(BACKEND_URL + "/" + i.profile_picture.filename)
                            }
                        })
                    })
            } else window.location = "/"
        })
    }, [])
    const changeProfilePicture = (e) => {
        const token = cookie.load('token');
        setInfo("Uploading image...");
        const formData = new FormData();
        formData.append('myfile', e.target.files[0]);
        formData.append('token', token);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        };
        axios.post(`${BACKEND_URL}/users/profile_picture`, formData, config)
            .then((res) => {
                setFile(BACKEND_URL + '/' + res.data);
                setInfo("");
            })
    }

    return (
        <div className="container">
            <div className="margin box box-shadow bg-dark text-light">
                <h1 className="box-title">Your Profile Picture:</h1>
                <h3>{info}</h3>
                <label htmlFor="upload-profile-picture">
                    <div className="box profile-box margin bg-light">
                        {file === null
                            ? <img src={profile} alt="Profile Logo" className="profile-picture" />
                            : <img src={file} alt="Profile Logo" className="profile-picture" />}
                    </div>
                    <center><p>Click the picture above to change your profile picture</p></center>
                </label>
                <input id="upload-profile-picture" type="file" accept="image/*" onChange={changeProfilePicture}></input>
                <Link to="/"><button className="btn btn-light form-control">Go to Home Page</button></Link>
            </div>
        </div>
    )
}

export default PP;