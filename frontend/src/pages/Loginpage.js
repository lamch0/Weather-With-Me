import "./Loginpage.css"
import * as Ti from "react-icons/ti";


function Loginpage() {
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
                        <form action="http://localhost:8000/login" method="POST">
                            <div className="login-input-field">
                                <label htmlFor="username">Username</label><br/>
                                <input type="text" name="username" id="username" placeholder="username" className="form-control" required/>
                            </div>
                            <div className="login-input-field ">
                                <label htmlFor="password">Password</label><br/>
                                <input type="password" name="password" id="password" placeholder="password" className="form-control" required/>
                            </div>
                            <div className="login-btn">
                                <button type="submit" className="btn btn-outline-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
} 
export default Loginpage;