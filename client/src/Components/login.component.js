import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = cookie.load('token');
        axios.get(`${BACKEND_URL}/users`)
            .then(res => {
                (res.data).forEach(i => {
                    if (i.token === token) window.location = "/";
                })
            })
    })

    const Submit = (e) => {
        e.preventDefault();

        const User = {
            username: username,
            password: password
        }
        axios.post(`${BACKEND_URL}/users/login`, User)
            .then(res => {
                if (res.status === 200) setError("");
                cookie.save('token', res.data, { path: '/' });
                window.location = "/";
            })
            .catch(err => {
                if (err) setError("Your username and/or password doesn't match")
            })
    }

    return (
        <div className="container">
            <form className="box bg-light text-dark box-shadow margin" onSubmit={Submit}>
                <h1 className="box-title">Login your account</h1>
                <div className="form-group">
                    <h4 className="form-error">{error}</h4>
                </div>
                <div className="form-group">
                    <p className="form-label">Username:</p>
                    <input className="form-control" type="text" value={username} onChange={({ target: { value } }) => setUsername(value.toLowerCase())} required></input>
                </div>
                <div className="form-group">
                    <p className="form-label">Password:</p>
                    <input className="form-control" type="password" value={password} onChange={({ target: { value } }) => setPassword(value)} required></input>
                </div>
                <div className="form-group">
                    <p className="form-label">Don't have account yet? <a className="link" href="/register">Register</a></p>
                </div>
                <div className="form-group">
                    <input className="form-control btn btn-dark" type="submit"></input>
                </div>
            </form>
        </div>
    )
}

export default Login;