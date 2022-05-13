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

const location_data=
{
        "id":123,
        "region": "Asia",
        "country": "China",
        "name": "Hong Kong",
        "lat": 22.302711,
        "lng": 114,
        "timezone_id":"8",
        "comments":[{"user": "user1", "content": "hi"}, {"user": "user2", "content": "hi"}]
}

function Locationpage() {
  return (
    <>
    <div className='banner'>

      <div id='icon'><Ti.TiWeatherCloudy/></div>
      <div id='title'>Weathering with ME</div>

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
    <div className='container'>
      <h1 className='text-center'>{location_data.name}</h1>

      <SimpleMap location={location_data}/>
      <hr></hr>
      <LocationInfo location={location_data}></LocationInfo>
      <hr></hr>
      <CommentArea comments={location_data.comments}></CommentArea>
    </div>
    </>
  )
}

class SimpleMap extends Component {
  static defaultProps = {
    zoom: 1
  };

  render() {
    return (
      <>
        <div id="map">
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDNzUJieo8rD3mAG5ZgZD7dZPEMUeMUuSI' }}
            defaultCenter={{lat: this.props.location.lat, lng: this.props.location.lng}}
            defaultZoom={this.props.zoom}
          >
            <div lat={this.props.location.lat} lng={this.props.location.lng}>
              <img id="pin" src={pin} alt="pin" onClick={() => { window.location.pathname = '/'+this.props.location.id; } } />
            </div>
          </GoogleMapReact>
        </div></>
    );
  }
}

class LocationInfo extends Component {
  render() {
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
                  <td>{this.props.location.region}</td>
                  <td>{this.props.location.country}</td>
                  <td>{this.props.location.name}</td>
                  <td>{this.props.location.lat}</td>
                  <td>{this.props.location.lng}</td>
                  <td>{this.props.location.timezone_id}</td>
                </tr>
              </tbody>
        </Table>
      </>
    )
  }
}

class CommentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ""
    };
  }
  
  handleComment(comment) {
    this.setState({comment: comment.target.value});
  }

  getComment() {
    console.log(this.state.comment);
  }
  
  render() {
    return (
      <>
        <h1 className="text-center">Comment Area</h1>
        {this.props.comments.map((file, index) => <Comment i={index} key={index}/>)}
        <h2>Add Comment</h2>
        <textarea className="w-100" value={this.state.comment} onChange={this.handleComment.bind(this)}></textarea>
        <Button onClick={this.getComment.bind(this)}>Add Comment</Button>
      </>
    )
  }
}

function Comment(props) {
    let i = props.i
    return (
      <>
        <h4>Name: {location_data.comments[i].name}</h4>
        <p>Content: {location_data.comments[i].comment}</p>
        <hr></hr>
      </>
    )
}

export default Locationpage