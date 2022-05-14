// 1155143373 Lam Lok Hin 
// 1155143281 Choi Chung Yu 
// 1155142376 Cheung King Wa 
// 1155110159 Cheung Hing Wing 
// 1155142672 Kwok Chun Yin
// 1155143825 Lam Cheuk Hin

import * as Fa from "react-icons/fa";
import * as Ti from "react-icons/ti";
import * as Md from "react-icons/md";
import userimg from "../components/user.jpg"
import locationimg from "../components/location.png"
import weatherapiimg from "../components/weatherapi.png"
import {useState} from "react"
import './Adminsite.css'
import axios from "axios";


function Admin(){
    const [state, setState] = useState(0);
    const [info, setInfo] = useState([]);

    function logout(){
        axios
            .delete("http://localhost:8000/api/logout", {withCredentials:true})
            .then((res) => {
                window.location.reload(false);
            })
            .catch((err) => {
                alert(err);
            })
    }

    return(
        <>
            <div className='banner'>
                <div id='icon'><Ti.TiWeatherCloudy/></div>
                <div id='title'>Weathering with ME</div>
                <div className='banner-right'>
                    <div id='icon'><Fa.FaUserCircle/></div>
                    <div id='text'>Admin</div>
                    <div id='vertical-line'></div>
                    <div id='icon'><Md.MdLogout/></div>
                    <div id='text' onClick={()=>logout()}>Logout</div>
                </div>
            </div>
            <div className="margin"></div>
            <div className="admin_page">
                <div className="title text-center">
                    <h2>Admin Site</h2>
                </div>
                <hr/>
                <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
                    <div className="feature col">
                        <Update/>
                    </div>
                    <div className="feature col">
                        <LocationUpdate/>
                    </div>
                    <div className="feature col">
                        <UserUpdate/>
                    </div>
                </div>
                {state == 1 && <Table info={info}/>}
            </div>
        </>
    )




function Update(){

    function refresh(){
        setState(0);
        fetch("http://localhost:8000/api/locations", {
            method: "GET"
        })
        .then((res) => {
            return res.text(res);
        })
        .then((res) => {
            res = JSON.parse(res);
            let inform = [];
            let x = res.length;
            for(let i = 0; i < x; i++){
                let check = [];
                fetch("http://api.weatherapi.com/v1/current.json?key=248213d7f27a4c5ea2274830221205&q=" + res[i].name + "&aqi=no", {
                    method: "get"
                })
                .then((res) => {
                    if(!res.ok){
                        throw "Error"
                    }
                    return res.text(res);
                })
                .then((res) => {
                    res = JSON.parse(res);
                    check.push(res.location.name);
                    check.push(res.location.lat);
                    check.push(res.location.lon);
                    check.push(res.location.localtime);
                    check.push(res.current.temp_c);
                    check.push(res.current.wind_kph);
                    check.push(res.current.wind_dir);
                    check.push(res.current.humidity);
                    check.push(res.current.precip_mm);
                    check.push(res.current.vis_km);
                    inform.push(check);
                    
                    if(i == x - 1){
                        setInfo(inform);
                        setState(1);
                    }
                })
            }
        })
    }

    return(
        <div className="card">
            <img src={weatherapiimg} className="card-img-top" alt="User image" />
            <div className="card-body">
                <h5 className="card-title">Request Data</h5>
                <p className="card-text">Fetch all the data from weatherapi</p>
                <button className="btn btn-primary" onClick={()=>refresh()}>Request</button>
            </div>
        </div>
    )
}



function UserUpdate(){

    function createUser(){
        document.querySelector("#userid").classList.remove("isinvalid");
        document.querySelector("#username").classList.remove("isinvalid");
        document.querySelector("#password").classList.remove("isinvalid");

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let bodytext = "username=" + username + "&password=" + password;

        if(username == ""){
            document.querySelector("#username").classList.add("isinvalid");
        }
        if(password == ""){
            document.querySelector("#password").classList.add("isinvalid");
        }
        if(username == "" || password == ""){
            alert("username or password cannot be blank.")
            return;
        }

        fetch("http://localhost:8000/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded"},
            body: bodytext
        })
        .then((res) => {
            if(!res.ok){
                throw res.text(res);
            }
            return res.text(res)
        })
        .then((res) => {
            alert("Success create! " + res);
            document.getElementById("userid").value = "";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        })
        .catch((err) => {
            err.then((err) => {
                alert(err);
            })
        })
    }

    function retrieveUser(){
        document.querySelector("#userid").classList.remove("isinvalid");
        document.querySelector("#username").classList.remove("isinvalid");
        document.querySelector("#password").classList.remove("isinvalid");

        let userid = document.getElementById("userid").value;
        if(userid == ""){
            alert("User id cannot be blank.")
            document.querySelector("#userid").classList.add("isinvalid");
            return;
        }

        fetch("http://localhost:8000/api/user/" + userid, {
            method: "GET"
        })
        .then((res) => {
            if(!res.ok){
                throw res.text(res)
            }
            return res.text(res)
        })
        .then((res) => {
            res = JSON.parse(res);
            document.querySelector("#username").value = res.username;
            document.querySelector("#password").value = res.password;
        })
        .catch((err) => {
            err.then((err) => {
                alert(err);
            })
        })
    }

    function updateUser(){
        document.querySelector("#userid").classList.remove("isinvalid");
        document.querySelector("#username").classList.remove("isinvalid");
        document.querySelector("#password").classList.remove("isinvalid");

        let userid = document.getElementById("userid").value;
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let textbody = "updatedname=" + username + "&updatedpassword=" + password;

        if(userid == ""){
            document.querySelector("#userid").classList.add("isinvalid");
        }
        if(username == ""){
            document.querySelector("#username").classList.add("isinvalid");
        }
        if(password == ""){
            document.querySelector("#password").classList.add("isinvalid");
        }
        if(userid == "" || username == "" || password == ""){
            alert("User id, username and password cannot be blank");
            return;
        }

        fetch("http://localhost:8000/api/user/update/" + userid, {
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded"},
            body: textbody
        })
        .then((res) => {
            if(!res.ok){
                throw res.text(res);
            }
            return res.text(res)
        })
        .then((res) => {
            alert("Success update! " + res);
            document.getElementById("userid").value = "";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        })
        .catch((err) => {
            err.then((err) => {
                alert(err);
            })
        })
    }

    function deleteUser(){
        document.querySelector("#userid").classList.remove("isinvalid");
        document.querySelector("#username").classList.remove("isinvalid");
        document.querySelector("#password").classList.remove("isinvalid");

        let userid = document.getElementById("userid").value;
        if(userid == ""){
            document.querySelector("#userid").classList.add("isinvalid");
            alert("User id cannot be blank");
            return;
        }

        fetch("http://localhost:8000/api/user/delete/" + userid, {
            method: "Delete"
        })
        .then((res) => {
            if(!res.ok){
                throw res.text(res)
            }
            return res.text(res);
        })
        .then((res) => {
            alert("Success delete! ");
            document.getElementById("userid").value = "";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        })
        .catch((err) => {
            err.then((err) => {
                alert(err);
            })
        })

    }

    return(
        <div className="card">
            <img src={userimg} className="card-img-top" alt="User image" />
            <div className="card-body">
                <h5 className="card-title">Modify User Data</h5>
                <ul className="card-text">
                    <li>Create : provide username and password</li>
                    <li>Retreive : provide user id</li>
                    <li>Update : provide user id, username and password</li>
                    <li>Delete : provide user id</li>
                </ul>
                <form className="formdata">
                    <div>
                        <label htmlFor="userid">Id</label>
                        <input type="text" name="userid" id="userid" placeholder="user id"/>
                    </div>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" placeholder="username"/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="text" name="password" id="password" placeholder="password"/>
                    </div>
                </form>
                <button className="btn btn-primary" onClick={() => createUser()}>Create</button>
                <button className="btn btn-primary" onClick={() => retrieveUser()}>Retreive</button>
                <button className="btn btn-primary" onClick={() => updateUser()}>Update</button>
                <button className="btn btn-primary" onClick={() => deleteUser()}>Delete</button>
            </div>
        </div>
    )
}



function LocationUpdate(){

    function createLocation(){
        document.querySelector("#locationname").classList.remove("isinvalid");
        document.querySelector("#locationid").classList.remove("isinvalid");
        document.querySelector("#locationlat").classList.remove("isinvalid");
        document.querySelector("#locationlong").classList.remove("isinvalid");

        let name = document.getElementById("locationname").value;
        let lat = document.getElementById("locationlat").value;
        let long = document.getElementById("locationlong").value;
        let bodytext = "name=" + name + "&lat=" + lat + "&lon=" + long;

        fetch("http://localhost:8000/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded"},
            body: bodytext})
            .then((res) => {
                if(!res.ok){
                    throw res.text(res);
                }
                return res.text(res);
            })
            .then((res) => {
                document.getElementById("locationid").value = "";
                document.getElementById("locationname").value = "";
                document.getElementById("locationlat").value = "";
                document.getElementById("locationlong").value = "";
                alert("Success create!")
            })
            .catch((err) => {
                if(name == ""){
                    document.querySelector("#locationname").classList.add("isinvalid");
                }
                if(lat == ""){
                    document.querySelector("#locationlat").classList.add("isinvalid");
                }
                if(long == ""){
                    document.querySelector("#locationlong").classList.add("isinvalid");
                }
                err.then((err) => {
                    alert(err);
                })
            })
    }

    function retrieveLocation(){
        document.querySelector("#locationname").classList.remove("isinvalid");
        document.querySelector("#locationid").classList.remove("isinvalid");
        document.querySelector("#locationlat").classList.remove("isinvalid");
        document.querySelector("#locationlong").classList.remove("isinvalid");

        let id = document.getElementById("locationid").value;
        if(id == ""){
            alert("Location id is missing");
            document.querySelector("#locationid").classList.add("isinvalid");
            return;
        }

        fetch("http://localhost:8000/api/location/" + id)
        .then(res => {
            if(!res.ok){
                throw res.text(res);
            }
            return res.text(res);
        })
        .then(res => {
            res = res.replaceAll("<br>", "");
            res = res.replaceAll("undefined", '""');
            res = JSON.parse(res);
            document.getElementById("locationname").value = res.name;
            document.getElementById("locationlat").value = res.lat;
            document.getElementById("locationlong").value = res.lon;
        })
        .catch((err) => {
            document.querySelector("#locationid").classList.add("isinvalid");
            err.then((err) => {
                alert(err);
            })
        })
    }

    function updateLocation(){
        document.querySelector("#locationname").classList.remove("isinvalid");
        document.querySelector("#locationid").classList.remove("isinvalid");
        document.querySelector("#locationlat").classList.remove("isinvalid");
        document.querySelector("#locationlong").classList.remove("isinvalid");

        let id = document.getElementById("locationid").value;
        if(id == ""){
            alert("Location id is missing");
            document.querySelector("#locationid").classList.add("isinvalid");
            return;
        }

        let name = document.getElementById("locationname").value;
        let lat = document.getElementById("locationlat").value;
        let long = document.getElementById("locationlong").value;
        let bodytext = "updatedname=" + name + "&updatelat=" + lat + "&updatelon=" + long;

        fetch("http://localhost:8000/api/location/update/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded"},
            body: bodytext})
            .then((res) => {
                if(!res.ok){
                    throw res.text(res);
                }
                return res.text(res);
            })
            .then((res) => {
                document.getElementById("locationid").value = "";
                document.getElementById("locationname").value = "";
                document.getElementById("locationlat").value = "";
                document.getElementById("locationlong").value = "";
                alert("Success update!")
            })
            .catch((err) => {
                if(name == ""){
                    document.querySelector("#locationname").classList.add("isinvalid");
                }
                if(lat == ""){
                    document.querySelector("#locationlat").classList.add("isinvalid");
                }
                if(long == ""){
                    document.querySelector("#locationlong").classList.add("isinvalid");
                }
                err.then((err) => {
                    alert(err);
                })
            })
    }

    function deleteLocation(){
        document.querySelector("#locationname").classList.remove("isinvalid");
        document.querySelector("#locationid").classList.remove("isinvalid");
        document.querySelector("#locationlat").classList.remove("isinvalid");
        document.querySelector("#locationlong").classList.remove("isinvalid");

        let id = document.getElementById("locationid").value;
        if(id == ""){
            alert("Location id is missing");
            document.querySelector("#locationid").classList.add("isinvalid");
            return;
        }

        fetch("http://localhost:8000/api/location/delete/" + id, {
            method: "DELETE",
        })
        .then((res) => {
            if(!res.ok){
                throw res.text(res);
            }
            return res.json(res);
        })
        .then((res) => {
            if(res.result){
                alert("You have deleted location " + id);
                document.getElementById("locationid").value = "";
                document.getElementById("locationname").value = "";
                document.getElementById("locationlat").value = "";
                document.getElementById("locationlong").value = "";
            }
        })
        .catch((err) => {
            document.querySelector("#locationid").classList.add("isinvalid");
            err.then((err) => {
                alert(err);
            })
        })
    }

    return(
        <div className="card">
            <img src={locationimg} className="card-img-top" alt="User image"/>
            <div className="card-body">
                <h5 className="card-title">Modify Stored Location Data</h5>
                <ul className="card-text">
                    <li>Create : provide location name, latitude and longitude</li>
                    <li>Retreive : provide location id</li>
                    <li>Update : provide location id, name, latitude and longitude</li>
                    <li>Delete : provide location id</li>
                </ul>
                <form className="formdata">
                    <div>
                        <label htmlFor="locationid">Id</label>
                        <input type="text" name="locationid" id="locationid" placeholder="location id"/>
                    </div>
                    <div>
                        <label htmlFor="locationname">Name</label>
                        <input type="text" name="locationname" id="locationname" placeholder="location name"/>
                    </div>
                    <div>
                        <label htmlFor="locationlat">Latitude</label>
                        <input type="text" name="locationlat" id="locationlat" placeholder="location latitude"/>
                    </div>
                    <div>
                        <label htmlFor="locationlong">Longitude</label>
                        <input type="text" name="locationlong" id="locationlong" placeholder="location longitude"/>
                    </div>
                </form>
                <button className="btn btn-primary" onClick={()=>createLocation()}>Create</button>
                <button className="btn btn-primary" onClick={()=>retrieveLocation()}>Retreive</button>
                <button className="btn btn-primary" onClick={()=>updateLocation()}>Update</button>
                <button className="btn btn-primary" onClick={()=>deleteLocation()}>Delete</button>
            </div>
        </div>
    )
}

function Table({info}){
    return(
    <div className="text-center">
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>Latitude</td>
                                <td>Longitude</td>
                                <td>Local Time</td>
                                <td>Temp_c</td>
                                <td>Wind KPH</td>
                                <td>Wind DIR</td>
                                <td>Humidity</td>
                                <td>Precip_mm</td>
                                <td>Vis_km</td>
                            </tr>
                            {info.map((element, index) =>  {
                                return(
                                <tr>
                                <td>{element[0]}</td>
                                <td>{element[1]}</td>
                                <td>{element[2]}</td>
                                <td>{element[3]}</td>
                                <td>{element[4]}</td>
                                <td>{element[5]}</td>
                                <td>{element[6]}</td>
                                <td>{element[7]}</td>
                                <td>{element[8]}</td>
                                <td>{element[9]}</td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </div>)
}

}
export default Admin;