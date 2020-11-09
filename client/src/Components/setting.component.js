import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import cookie from "react-cookies";
import { NavLink } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const token = cookie.load('token');
const check_logged_in = async () => {
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
const Setting = () => {
    const [UserInfo, setUserInfo] = useState(null);
    const [inputOldPassword, setInputOldPassword] = useState('');
    const [inputNewPassword, setInputNewPassword] = useState('');
    const [inputConfirmNewPassword, setInputConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        check_logged_in().then(result => {
            if (!result) window.location = "/login";
            else setUserInfo(result)
        })
    })

    useEffect(() => {
        if (inputNewPassword !== inputConfirmNewPassword) {
            setError('Password and confirmation must match!')
        } else {
            setError('')
        }
    }, [inputNewPassword, inputConfirmNewPassword])

    const ChangePassword = (e) => {
        e.preventDefault();
        Axios.post(`${BACKEND_URL}/users/change_pass`, { oldPassword: inputOldPassword, newPassword: inputNewPassword, token: UserInfo.token, user: UserInfo._id })
            .then(() => {
                setSuccess("Password updated")
            })
            .catch(() => setError('Something went wrong. Please try again'));
    }
    return (
        <div className="container">
            {UserInfo ?
                <div>
                    <form className="margin box box-shadow text-dark" onSubmit={ChangePassword}>
                        <h1 className="box-title">Reset your password:</h1>
                        <h4 className="form-error">{error}</h4>
                        <h4 className="text-success">{success}</h4>
                        <div className="form-group">
                            <p className="form-label">Old Password:</p>
                            <input className="form-control" type="password" value={inputOldPassword} onChange={({ target: { value } }) => setInputOldPassword(value)} required />
                        </div>
                        <div className="form-group">
                            <p className="form-label">New Password:</p>
                            <input className="form-control" type="password" value={inputNewPassword} onChange={({ target: { value } }) => setInputNewPassword(value)} required />
                        </div>
                        <div className="form-group">
                            <p className="form-label">Confirm new password:</p>
                            <input className="form-control" type="password" value={inputConfirmNewPassword} onChange={({ target: { value } }) => setInputConfirmNewPassword(value)} required />
                        </div>
                        <div className="form-group">
                            <input type="submit" className="form-control btn btn-dark" />
                        </div>
                    </form>
                    <div className="margin box box-shadow text-dark">
                        <h3><NavLink className="link" to="/setting/profile">Edit Profile Here</NavLink></h3>
                    </div>
                </div>
                : null}
        </div>
    )
}

export default Setting;