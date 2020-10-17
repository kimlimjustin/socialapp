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
import CreatePost from "./Components/create-post.component";
import Post from "./Components/post.component";
import EditPost from "./Components/edit-post.component";
import Setting from "./Components/setting.component";

const App = () => (
    <Router forceRefresh>
        <Navbar />
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component = {Register} />
            <Route path="/login" component = {Login} />
            <Route path="/setting/profile-picture" component = {PP} />
            <Route path="/setting/profile" component = {EditProfile} />
            <Route path="/post/create" component = {CreatePost} />
            <Route path="/post/:id/edit" component = {EditPost} />
            <Route path="/post/:id" component = {Post} />
            <Route path="/u/:username" component={Profile} />
            <Route path="/setting" component = {Setting} />
            <Route path="*" component = {FourZeroFour}/>
        </Switch>
    </Router>
);

export default App;