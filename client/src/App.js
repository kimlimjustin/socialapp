import React from 'react';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import "hurl-ui/HurlUI.css";
import "hurl-ui/HurlUI";

import Register from "./Components/register.component";
import Login from "./Components/login.component";
import Home from "./Components/home.component";
import Navbar from "./Components/navbar.component";
import PP from "./Components/profile_picture.component";
import FourZeroFour from "./Components/404.component";
import Profile from "./Components/profile.component";
import EditProfile from "./Components/edit_profile.component";

const App = () => (
    <Router>
        <Navbar />
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component = {Register} />
            <Route path="/login" component = {Login} />
            <Route path="/setting/profile-picture" component = {PP} />
            <Route path="/setting/profile" component = {EditProfile} />
            <Route path="/u/:username" component={Profile} />
            <Route path="*" component = {FourZeroFour}/>
        </Switch>
    </Router>
);

export default App;