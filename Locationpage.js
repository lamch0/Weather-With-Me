import React, { Component ,useState ,useEffect } from 'react'
import './Homepage.css'
import * as Ti from "react-icons/ti";
import * as Ai from "react-icons/ai";
import * as Fa from "react-icons/fa";
import * as Bs from "react-icons/bs";
import * as Md from "react-icons/md";
import GoogleMapReact from 'google-map-react';
import pin from "../components/pin.png";
import { Table, Button } from 'react-bootstrap';
import axios from "axios";
// import { init } from '../../../models/location_model';

let loc = window.location.href.replace("http://localhost:3000/Singlelocation/", "").replace("%20", " ");
let url = "http://api.weatherapi.com/v1/current.json?key=248213d7f27a4c5ea2274830221205&q=" + loc + "&aqi=no";

function Locationpage() {

  const [weather, setWeather] = useState([{}]);

    useEffect(() => {
        axios.get(url)
        .then((response) => {
        setWeather(response.data);
        });
        }, []);
  try{
    console.log(weather.location.name)
    return (
      <>
      <div className='banner'>

        <div id='icon'><Ti.TiWeatherCloudy/></div>
        <div id='title' onClick={()=>{window.location.pathname="/"}}>Weathering with ME</div>

        <div className='banner-right'>

          <div id='icon'><Fa.FaUserCircle/></div>
          <div id='text'>Username</div>
          <div id='vertical-line'></div>
          <div id='icon'><Bs.BsFillBookmarkHeartFill/></div>
          <div id='text'>Favourite</div>
          <div id='vertical-line'></div>
          <div id='icon'><Md.MdLogout/></div>
          <div id='text'>Logout</div>

        </div>
      </div>
      <div className='margin'></div>
      <div className='container'>
        <h1 className='text-center'>{loc}</h1>

        <SimpleMap location={weather.location}/>
        <hr></hr>
        <LocationInfo data={weather}></LocationInfo>
        <hr></hr>
        <CommentArea></CommentArea>
      </div>
      </>
    )
  }catch(e){
    return("Error occur" + e)
  }
}

class SimpleMap extends Component {
  render() {
    return (
      <>
        <div id="map" style={{width:"40vw"}}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDNzUJieo8rD3mAG5ZgZD7dZPEMUeMUuSI' }}
            defaultCenter={{lat: this.props.location.lat, lng: this.props.location.lon}}
            defaultZoom={1}
          >
            <div lat={this.props.location.lat} lng={this.props.location.lon}>
              <img id="pin" src={pin} alt="pin"/>
            </div>
          </GoogleMapReact>
        </div>
      </>
    );
  }
}

class LocationInfo extends Component {
  render() {
    console.log(this.props.data.current)
    return (
      <>
        <h1 className="text-center">Location Information</h1>
        <Table striped bordered hover>
          <thead>
              <tr>
                <th id="table_title">Region</th>
                <th id="table_title">Country</th>
                <th id="table_title">Name</th>
                <th id="table_title">Latitude</th>
                <th id="table_title">Longitude</th>
                <th id="table_title">Timezone</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>{this.props.data.location.region}</td>
                  <td>{this.props.data.location.country}</td>
                  <td>{this.props.data.location.name}</td>
                  <td>{this.props.data.location.lat}</td>
                  <td>{this.props.data.location.lon}</td>
                  <td>{this.props.data.location.tz_id}</td>
                </tr>
              </tbody>
        </Table>
        <br></br>
        <Table striped bordered hover>
          <thead>
              <tr>
                <th id="table_title">Temperature</th>
                <th id="table_title">Wind Speed</th>
                <th id="table_title">Wind Direction</th>
                <th id="table_title">Humidity</th>
                <th id="table_title">Precipitation</th>
                <th id="table_title">Visibility</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>{this.props.data.current.temp_c} degree celsius</td>
                  <td>{this.props.data.current.wind_kph} kph</td>
                  <td>{this.props.data.current.wind_dir}</td>
                  <td>{this.props.data.current.humidity}</td>
                  <td>{this.props.data.current.precip_mm} mm</td>
                  <td>{this.props.data.current.vis_km} km</td>
                </tr>
              </tbody>
        </Table>
      </>
    )
  }
}

function deleteComment(commentId) {

  fetch("http://localhost:8000/api/comments/delete/" + loc + "/" + commentId + "/1652344369760", {
      method: "DELETE"
    })
      .then(() => {
        alert("Comment deleted");
      })
      .catch((err) => {
          err.then((err) => {
              alert("error:" + err);
          })
      })
  }

function CommentArea() {

    const [comments, setComment] = useState([]);
    
    useEffect(() => {
      axios.get("http://localhost:8000/api/location/getcomment/name?name=" + loc)
      .then((res) => {
        setComment(res.data);
      })
    }, []);

    try{
      console.log("comment: " + comments)
    
    return (
      <>
        <h1 className="text-center">Comment Area</h1>
        <div className="commentArea">
          {comments.map((comment) => 
          <>
          <div id={"comment" + comment.comment_id}>
          <h4>User: {comment.user_id}</h4>
          <p>Content: {comment.content} {comment.comment_id}</p>
          <Button id={comment.comment_id} onClick={deleteComment.bind(this, comment.comment_id)}>Delete Comment</Button>
          <hr></hr>
          </div>
        </>)}
        </div>
        <h2>Add Comment</h2>
        <Comment></Comment>
      </>
    )
  } catch(e) {
    return("No Comment")
  }
}

function addComment() {

  if(document.getElementById("commentBox").value == ""){
      alert("Please Enter Comment");
      return;
  } else {
    let comment = document.getElementById("commentBox").value;
    console.log(comment);
  
  
  let bodytext = "user_id=1652344369760" + "&content=" + comment;

  fetch("http://localhost:8000/api/comments/" + loc, {
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
          document.getElementById("commentBox").value = "";
          console.log(res);
      })
      .catch((err) => {
          console.log(err);
      })
  }
}

function Comment() {
  return (
    <>
      <textarea className="w-100" id="commentBox"></textarea>
      <Button onClick={addComment.bind(this)}>Add Comment</Button>
    </>
  )
}

export default Locationpage