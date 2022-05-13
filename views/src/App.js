import React from 'react'
import "./App.css"
import Homepage from './pages/Homepage.js'
import Admin from './pages/Adminsite.js'
import Locationpage from './pages/Locationpage.js'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import * as Ti from "react-icons/ti";
import  {useEffect, useState} from "react"
import axios from "axios";

function App() {
    const [status, setStatus] = useState(0);

    useEffect(() => {
        console.log("useEffect")
        axios
        .get("http://localhost:8000/api/userloggedin")
        .then((res) => console.log(res))
        
    }, [])

    function Loginpage() {

        function login(){
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let bodytext = "username=" + username + "&password=" + password;

            fetch("http://localhost:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded"},
                headers: { "Access-Control-Allow-Origin": "*"},
                headers: { "Access-Control-Allow-Credentials": "*"},
                body: bodytext})
                .then((res) => {
                    return res.text(res);
                })
                .then((res) => {
                    console.log((res));
                })
        }
    
        return (
            <section className="loginpage">
                <div className="container fadeInDown">
                    <div className="row">
                        <div className="loginform col-3 mx-auto">
                            <div className="title text-center">
                                <h4>Weathering with Me</h4>
                            </div>
                            <div className="logo">
                                <Ti.TiWeatherCloudy/>
                            </div>
                            <form method="POST" action="http://localhost:8000/login">
                                <div className="login-input-field">
                                    <label htmlFor="username">Username</label><br/>
                                    <input type="text" name="username" id="username" placeholder="username" className="form-control" />
                                </div>
                                <div className="login-input-field ">
                                    <label htmlFor="password">Password</label><br/>
                                    <input type="password" name="password" id="password" placeholder="password" className="form-control" />
                                </div>
                                <div className="login-btn">
                                    <button type="button" className="btn btn-outline-primary" onClick={()=>login()}>Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )
    } 

    return (
        <>
        <div className='App'>
            <Router>
            <Routes>
            <Route path='/login' element={<Loginpage/>} />
            
            <Route path='/home' element={<Homepage/>} />
            <Route path='/Singlelocation/:location' element={<Locationpage/>} />

            <Route path='/admin' element={<Admin/>} />
            </Routes>
            </Router>
            </div>
        </>
    );
}

export default App


