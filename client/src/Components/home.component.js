import React, { useEffect } from "react";
import cookie from 'react-cookies';
import axios from "axios";

const token = cookie.load('token');
async function check_token(){
  var logged_in = false
  await axios.get('http://localhost:5000/users')
  .then(res => {
      (res.data).forEach(i=> {
          if(i.token === token){
              logged_in = true
              return true
          }
      })
  })
  .catch(err => console.log(err));
  return logged_in
}

const Home = () => {
    useEffect(() => {
        check_token().then(result => {
            if(!result) window.location = "/register";
        })
    })
    return(
        <div className="container">
            <p>Home Page</p>
        </div>
    )
}

export default Home;