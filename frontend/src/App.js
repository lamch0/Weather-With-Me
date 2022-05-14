import React from 'react'
import "./App.css"
import Homepage from './pages/Homepage.js'
import Admin from './pages/Adminsite.js'
import Request from './pages/Adminsite.js'
import Locationpage from './pages/Locationpage.js'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import * as Ti from "react-icons/ti";
import  {useEffect, useState} from "react"
import axios from "axios";

function App() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/userloggedin" , {withCredentials:true})
            .then((res) => {
                if(res.data == ""){
                    setStatus(0);
                    setLoading(true);
                }
                if(res.data.user_type == "user"){
                    setStatus(1);
                    setLoading(true);
                }
                if(res.data.user_type == "admin"){
                    setStatus(2);
                    setLoading(true);
                }
            })
    }, [])

    function Loginpage() {

        function login(){
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let bodytext = "username=" + username + "&password=" + password;

            if(username.length < 4 || username.length > 20 || password.length < 4 || password.lenghtn > 20){
                alert("Size of sername and password should be smaller than 4 and not longer than 20.")
                return;
            }

            let payload = {username : username, password: password}
            axios
                .post("http://localhost:8000/login/", bodytext, {withCredentials:true})
                .then((res) => {
                    if(res.data == false){
                        alert("Incorrect username or password!");
                    }else{
                        axios
                            .get("http://localhost:8000/api/userloggedin" , {withCredentials:true})
                            .then((res) => {
                                if(res.data == ""){
                                    setStatus(0);
                                    setLoading(true);
                                }
                                if(res.data.user_type == "user"){
                                    setStatus(1);
                                    setLoading(true);
                                }
                                if(res.data.user_type == "admin"){
                                    setStatus(2);
                                    setLoading(true);
                                }
                            })
                    }
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

    if(!loading){
        return (<></>)
    }

    if(loading && status == 0){
        return (
            <>
            <div className='App'>
                <Router>
                <Routes>
                    
                <Route path='/' element={<Loginpage/>} />
    
                </Routes>
                </Router>
                </div>
            </>
        );
    }

    if(loading && status == 1){
        return (
            <>
            <div className='App'>
                <Router>
                <Routes>
                    
                <Route path='/' element={<Homepage/>} />
                <Route path='/Singlelocation/:location' element={<Locationpage/>} />
    
                </Routes>
                </Router>
                </div>
            </>
        );
    }

    if(loading && status == 2){
        return (
            <>
            <div className='App'>
                <Router>
                <Routes>

                <Route path='/' element={<Admin/>} />

                </Routes>
                </Router>
                </div>
            </>
        );
    }
    
}

export default App


