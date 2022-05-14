import "./Loginpage.css"
import * as Ti from "react-icons/ti";
import axios from "axios"


function Loginpage() {

        function login(){
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let bodytext = "username=" + username + "&password=" + password;

            // fetch("http://localhost:8000/login", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/x-www-form-urlencoded"},
            //     body: bodytext,
            //     headers: { "Access-Control-Allow-Origin": "*"},
            //     headers: { "Access-Control-Allow-Credentials": "*"},
            //     credentials: 'include',
            //     })
            //     .then((res) => {
            //         return res.text(res);
            //     })
            //     .then((res) => {
            //         console.log((res));
            //     })

            let payload = {username : username, password: password}
            axios.post("http://localhost:8000/login/", bodytext, {withCredentials:true})
                
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

export default Loginpage;