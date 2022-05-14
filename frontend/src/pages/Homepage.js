import React, { Component ,useState ,useEffect } from 'react'
import './Homepage.css'
import * as Ti from "react-icons/ti";
import * as Ai from "react-icons/ai";
import * as Fa from "react-icons/fa";
import * as Bs from "react-icons/bs";
import * as Bi from "react-icons/bi";
import * as Md from "react-icons/md";
import GoogleMapReact from 'google-map-react';
import pin from "../components/pin.png";
import { Table, Button } from 'react-bootstrap';
import axios from "axios";

function Homepage() {

  const [items, setItems] = useState([{}]);


    useEffect(() => {
        axios.get("http://localhost:8000/api/locations").then((response) => {
        setItems(response.data);
        });
        }, []);
  

  const [SearchItems, setSearchItems] = useState("");
    try{

  return (
    <>
    <div className='banner'>

      <div id='icon'><Ti.TiWeatherCloudy/></div>
      <div id='title' onClick={()=>{window.location.pathname="/"}}>Weathering with ME</div>

      <div className='banner-right'>

        <div id='icon'><Fa.FaUserCircle/></div>
        <div id='text' style={{width:"4vw"}}><Name/></div>
        <div id='vertical-line'></div>
        <div id='icon'><Bs.BsFillBookmarkHeartFill/></div>
        <div id='text'>Favourite</div>
        <div id='vertical-line'></div>
        <div id='icon'><Md.MdLogout/></div>
        <div id='text'>Logout</div>

      </div>
    </div>
    <div className='margin'></div>

    <div>
      <SimpleMap locations={items}/>
    </div>
    
    <div className="search">
      <div id="icon"><Ai.AiOutlineSearch /></div>
      <input id="bar" type="text" placeholder="Search..." />
      <select name="search_field" id="search_field" onClick={
        (e)=>{setSearchItems("");}}>

      <option value="name" >Name</option>
      <option value="lat">Latitude</option>
      <option value="lon">Longitude</option>

      </select>
      <Button id="button" onClick={(e)=>
      {
        let SearchItemsLowerCase = document.getElementById("bar").value.toLowerCase();
        setSearchItems(SearchItemsLowerCase);}
      }>Search</Button>
      <Button id="button" onClick={(e)=>
      {
        document.getElementById("bar").value="";
        let SearchItemsLowerCase = "";
        setSearchItems(SearchItemsLowerCase);}
      }>Reset</Button>
    </div>
    <Location_Table input={SearchItems}/>
    </>
  )
    }catch(e){
      return("");
    }
}

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 22,
      lng: 114
    },
    zoom: 1
  };

  render() {
    return (
      <>
        <div id="map">
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDNzUJieo8rD3mAG5ZgZD7dZPEMUeMUuSI' }}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
          >
            {this.props.locations.map(item => {
                  return (
                    <div lat={item.lat} lng={item.lon}>
                      <img id="pin" src={pin} alt="pin" onClick={() => { window.location.pathname = '/Singlelocation/'+item.name; } } />
                    </div>
                  );
            })}
          </GoogleMapReact>
        </div></>
    );
  }
}

function get_field(){
  return document.getElementById("search_field").value;
}


function location(item) {
  console.log(item)
}

function Location_Table(props){
  
  const [location, setlocation]=useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/locations").then((response) => {
    setlocation(response.data);
    });
    }, []);


  const [username, setUser] = useState({});

  
    useEffect(() => {
        axios.get("http://localhost:8000/api/userloggedin", {withCredentials : true}).then((response) => {
        setUser(response.data);
        });
    }, []);

  const [selected_name, setselectedname]=useState("0")
  const [selected_lat, setselectedlat]=useState("0")
  const [selected_lon, setselectedlon]=useState("0")

  
  const matchData = location.filter((items) => {
    if (props.input === '') {
        return items;
    }
    else if(get_field()==="name"){
      return items.name.toLowerCase().includes(props.input);
    }
    else if(get_field()==="lat"){
      return items.lat.toString().includes(props.input);
    }
    else if(get_field()==="lon"){
      return items.lon.toString().includes(props.input);
    }

})

  const [order, setorder]=useState("ASC")
  const sorting_char=(col)=>{
    setselectedname(1);
    setselectedlat(0);
    setselectedlon(0);
    if (order==="ASC"){
      const sorted=[...location].sort((a,b)=>a[col].toLowerCase()>b[col].toLowerCase()? 1:-1);
      setlocation(sorted);
      setorder("DSC");
    }
    if (order==="DSC"){
      const sorted=[...location].sort((a,b)=>a[col].toLowerCase()<b[col].toLowerCase()? 1:-1);
      setlocation(sorted);
      setorder("ASC");
    }
  }
  const sorting_int=(col)=>{
    setselectedname(0);
    if(col=="lat"){
      setselectedlat(1);
      setselectedlon(0);
    }
    if(col=="lon"){
      setselectedlat(0);
      setselectedlon(1);
    }
    if (order==="ASC"){
      const sorted=[...location].sort((a,b)=>a[col]-b[col]);
      setlocation(sorted);
      setorder("DSC");
    }
    if (order==="DSC"){
      const sorted=[...location].sort((a,b)=>b[col]-a[col]);
      setlocation(sorted);
      setorder("ASC");
    }
  }

    function Sort_icon(){
      if (selected_name===1){
          if (order=="ASC"){
            return(<Bi.BiSortZA/>)
          }else{
            return(<Bi.BiSortAZ/>)
          }
      }else{
        return ("")
      }
    }
    function Sort_icon1(){
      if (selected_lat===1){
          if (order=="ASC"){
            return(<Bs.BsSortNumericUp/>)
          }else{
            return(<Bs.BsSortNumericDown/>)
          }
      }else{
        return ("")
      }
    }
    function Sort_icon2(){
      if (selected_lon===1){
          if (order=="ASC"){
            return(<Bs.BsSortNumericUp/>)
          }else{
            return(<Bs.BsSortNumericDown/>)
          }
      }else{
        return ("")
      }
    }


    return(
    <>
    
        <div className="location_table" >
      <Table striped bordered hover>
      <thead>
          <tr>

            <th id="table_title" onClick={()=>sorting_char("name")}>name &nbsp;{Sort_icon()}</th>
            <th id="table_title" onClick={()=>sorting_int("lat")}>Latitude &nbsp;{Sort_icon1()}</th>
            <th id="table_title" onClick={()=>sorting_int("lon")}>Longitude &nbsp;{Sort_icon2()}</th>

            <th id="table_title1" style={{width:"6vw"}}>Weather Information</th>
            <th id="table_title1" style={{width:"6vw"}}>Add to Favourite</th>
          </tr>
        </thead>
        {matchData.map((item) => {
      return(
        <tbody>
            <tr>

              <td>{item.name}</td>
              <td>{item.lat}</td>
              <td>{item.lon}</td>

              <td><Button onClick={() => { window.location.pathname = '/Singlelocation/'+ item.name; } } >View Details</Button></td>
              <td><Button onClick={()=>{
                  axios.put("http://localhost:8000/api/favourite/"+username.username+"/"+item.loc_id,{withCredentials : true})
                    .then((res)=>{
                      console.log((res));
                    })}}>Add</Button></td>
            </tr>
          </tbody>
          );
          })}
    </Table>
    </div>
      
    
    </>
    
    
    )
}

function Name(){
    
  const [items, setItems] = useState({});

  
  useEffect(() => {
      axios.get("http://localhost:8000/api/userloggedin", {withCredentials : true}).then((response) => {
      setItems(response.data);
      });
  }, []);
  try{
   return(
           <>
           {items.username}
           </>
   )
   }catch(e){
     return("error")
   }
}




export default Homepage
