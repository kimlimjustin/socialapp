import React from 'react';

import {BrowserRouter as Router, Route} from 'react-router-dom';
import "hurl-ui/HurlUI.css";
import "hurl-ui/HurlUI";

import Register from "./Components/register.component";
import Login from "./Components/login.component";
import Home from "./Components/home.component";
import Navbar from "./Components/navbar.component";

const App = () => (
    <Router>
        <Navbar />
        <Route path="/" exact component={Home} />
        <Route path="/register" component = {Register} />
        <Route path="/login" component = {Login} />
    </Router>
);

export default App;