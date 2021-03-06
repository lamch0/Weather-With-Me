// 1155143373 Lam Lok Hin
// 1155143281 Choi Chung Yu
// 1155142376 Cheung King Wa 
// 1155110159 Cheung Hing Wing 
// 1155142672 Kwok Chun Yin
// 1155143825 Lam Cheuk Hin



import React, { Component ,useState ,useEffect } from 'react'
import './Homepage.css'
import * as Ti from "react-icons/ti";
import * as Ai from "react-icons/ai";
import * as Fa from "react-icons/fa";
import * as Bs from "react-icons/bs";
import * as Bi from "react-icons/bi";
import * as Md from "react-icons/md";
import GoogleMapReact from 'google-map-react';
import pin from "../components/pin2.png";
import { Table, Button } from 'react-bootstrap';
import axios from "axios";
import {useLocation,useParams} from 'react-router-dom';
function Favourite() {
    const params=useParams();
  const [items, setItems] = useState([{}]);
  const [username, setUser] = useState({});

  
  useEffect(() => {
    axios.get("http://localhost:8000/api/favourite/"+params.username).then((response) => {
    setItems(response.data);
    });
    }, []);

        
     console.log(items)

    
  
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
        <div id='text' onClick={()=>{
          axios
          .delete("http://localhost:8000/api/logout", {withCredentials:true})
          .then((res) => {
            window.location.pathname="/";
          })
          .catch((err) => {
              alert(err);
          })
        }}>Logout</div>

      </div>
    </div>
    <div className='margin'></div>
    <div className='title_favourite'><Bs.BsFillBookmarkHeartFill/> &nbsp;Favourite Location</div>

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
    const params=useParams();
  const [location, setlocation]=useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/favourite/"+params.username, {withCredentials:true}).then((response) => {
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

const [order, setorder]=useState("asc")
function sorting_char(column){
  setselectedname(1);
  setselectedlat(0);
  setselectedlon(0);
  if (order==="asc"){
    let location_sorted=[...location].sort((a,b)=>a[column].toLowerCase()>b[column].toLowerCase()? 1:-1);
    setlocation(location_sorted);
    setorder("desc");
  }
  if (order==="desc"){
    let location_sorted=[...location].sort((a,b)=>a[column].toLowerCase()<b[column].toLowerCase()? 1:-1);
    setlocation(location_sorted);
    setorder("asc");
  }
}
function sorting_int(column){
  setselectedname(0);
  if(column=="lat"){
    setselectedlat(1);
    setselectedlon(0);
  }
  if(column=="lon"){
    setselectedlat(0);
    setselectedlon(1);
  }
  if (order==="asc"){
    let location_sorted=[...location].sort((a,b)=>a[column]-b[column]);
    setlocation(location_sorted);
    setorder("desc");
  }
  if (order==="desc"){
    let location_sorted=[...location].sort((a,b)=>b[column]-a[column]);
    setlocation(location_sorted);
    setorder("asc");
  }
}

  function Sort_icon(){
    if (selected_name===1){
        if (order=="asc"){
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
        if (order=="asc"){
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
        if (order=="asc"){
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
            <th id="table_title1" style={{width:"6vw"}}> Delete Favourite</th>
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
              <td><Button onClick={()=>{axios.put("http://localhost:8000/api/favourite/"+username.username+"/"+item.loc_id,{withCredentials : true})}}>Delete</Button></td>
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




export default Favourite
