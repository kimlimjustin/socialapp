import Axios from "axios";
import React, { useEffect, useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const SearchUser = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        Axios.get(`${BACKEND_URL}/users`)
            .then(res => {
                (res.data).forEach((user) => {
                    setUserList(users => [...users, user.username])
                })
            })
    }, [])

    const FilterUser = (e) => {
        var filter, ul, li, div, txtValue;

        filter = e.target.value.toLowerCase();
        ul = document.querySelector("#users");
        li = ul.getElementsByTagName('li');

        for (let i = 0; i < li.length; i++) {
            let user = li[i];
            div = user.getElementsByTagName('div')[0];
            txtValue = div.textContent || div.innerText;
            if (txtValue.toLowerCase().indexOf(filter) === -1) user.style.display = "none";
            else user.style.display = "block";
        }
    }

    return (
        <div className="container">
            <div className="margin box box-shadow">
                <div className="form-group">
                    <p className="form-label">Search for username:</p>
                    <input type="text" className="form-control" placeholder="Search for username..." id="searchUsername" onChange={FilterUser} />
                </div>
                <ul id="users">
                    {userList.map((user) => {
                        return <li key={user} className="user"><div className="box" onClick={() => window.location = `/u/${user}`}>{user}</div></li>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default SearchUser;