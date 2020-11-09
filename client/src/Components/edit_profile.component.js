import Axios from "axios";
import React, { useEffect, useState } from "react";
import cookie from "react-cookies";
import { NavLink } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const token = cookie.load('token');
const logged_in = async () => {
    let is_logged_in = false
    if (token === null) is_logged_in = false;
    await Axios.get(`${BACKEND_URL}/users`)
        .then(res => {
            (res.data).forEach((i) => {
                if (i.token === token) is_logged_in = i
            })
        })
    return is_logged_in
}

const EditProfile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        logged_in().then(result => {
            if (!result) window.location = "/";
            setUsername(result.username);
            setEmail(result.email);
            if (result.name) setName(result.name)
            if (result.bio) setBio(result.bio);
            if (result.website) setWebsite(result.website);
        })
    }, [])

    const Submit = (e) => {
        e.preventDefault();
        const profile = {
            username: username,
            email: email,
            bio: bio,
            name: name,
            website: website,
            token: token
        }
        Axios.post(`${BACKEND_URL}/users/profile`, profile)
            .then(res => setMessage(res.data))
            .catch(() => setError("Something went wrong. Please try again"))
    }

    return (
        <form className="container margin box box-shadow" onSubmit={Submit}>
            <h1 className="box-title">Your Profile:</h1>
            {message ? <h3 className="form-label text-success">{message}</h3> : null}
            <h3 className="form-error">{error}</h3>
            <div className="form-group">
                <p className="form-label">Username:</p>
                <input type="text" className="form-control" value={username} onChange={({ target: { value } }) => setUsername(value.toLowerCase())} required />
            </div>
            <div className="form-group">
                <p className="form-label">Email:</p>
                <input type="email" className="form-control" value={email} onChange={({ target: { value } }) => setEmail(value)} required />
            </div>
            <div className="form-group">
                <p className="form-label">Your name:</p>
                <input type="text" className="form-control" value={name} onChange={({ target: { value } }) => setName(value)} />
            </div>
            <div className="form-group">
                <p className="form-label">Bio:</p>
                <textarea maxLength="500" className="form-control" rows="5" value={bio} onChange={({ target: { value } }) => setBio(value)}></textarea>
            </div>
            <div className="form-group">
                <p className="form-label">Website:</p>
                <input type="url" className="form-control" value={website} onChange={({ target: { value } }) => setWebsite(value)} />
            </div>
            <div className="form-group">
                <h4 className="form-label"><NavLink to="/setting/profile-picture" className="link">Change Profile Picture here</NavLink></h4>
            </div>
            <div className="form-group">
                <input type="Submit" className="btn btn-light form-control" />
            </div>
        </form>
    )
}

export default EditProfile;