import axios from "axios";
import React, { useState , useEffect} from "react";
import profile from "../Icons/profile.png";
import cookie from 'react-cookies';

const token = cookie.load('token');
async function check_token(){
  var logged_in = false
  await axios.get('http://localhost:5000/users')
  .then(res => {
      console.log(res);
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

const PP = () => {
    const [file, setFile] = useState(null);
    const [info, setInfo] = useState('');

    useEffect(()=> {
        check_token().then(result => {if(!result) window.location = '/'})
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
        axios.post('http://localhost:5000/users/profile_picture', formData, config)
        .then((res) => {
            setFile("http://localhost:5000/"+res.data);
            setInfo("");
        })
    }

    return(
        <div className="container">
            <div className="margin box box-shadow bg-dark text-light">
                <h1 className="box-title">Your Profile Picture:</h1>
                <h3>{info}</h3>
                <label htmlFor="upload-profile-picture">
                    <div className="box profile-box margin bg-light">
                        {file === null 
                        ?<img src={profile} alt="Profile Logo" className="profile-picture" />
                        :<img src={file} alt="Profile Logo" className="profile-picture" /> }
                    </div>
                    <center><div className="btn btn-light margin">Change Profile Picture</div></center>
                </label>
                <input id="upload-profile-picture" type="file" accept="image/*" onChange={changeProfilePicture}></input>
            </div>
        </div>
    )
}

export default PP;