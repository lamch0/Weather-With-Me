import React, { Component ,useState ,useEffect} from 'react'
import './Homepage.css'
import * as Ti from "react-icons/ti";
import * as Ai from "react-icons/ai";
import * as Fa from "react-icons/fa";
import * as Bs from "react-icons/bs";
import * as Md from "react-icons/md";
import GoogleMapReact from 'google-map-react';
import pin from "../components/pin.png";
import Table from 'react-bootstrap/Table';



const location_data=[  
      {
        "id":123,
        "region": "Asia",
        "country": "China",
        "name": "Hong Kong",
        "lat": "22.302711",
        "lng": "114",
        "timezone_id":"8"
      },{
        "id":124,
        "region": "Europe",
        "country": "United Kingdom",
        "name": "London",
        "lat": "51.507359",
        "lng": "-0.136439",
        "timezone_id":"1"
      },{
        "id":124,
        "region": "Europe",
        "country": "France",
        "name": "Paris",
        "lat": "48.864716",
        "lng": "2.34",
        "timezone_id":"1"
      }
]
function Homepage() {

  const [SearchItems, setSearchItems] = useState("");
  
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
    <div>
      <SimpleMap locations={location_data}/>
    </div>
    
    <div className="search">
      <div id="icon"><Ai.AiOutlineSearch /></div>
      <input id="bar" type="text" placeholder="Search..." onChange={(e)=>{
                    let SearchItemsLowerCase = e.target.value.toLowerCase();
                    setSearchItems(SearchItemsLowerCase);}}/>
      <select name="search_field" id="search_field">
      <option value="region">Region</option>
      <option value="country">Country</option>
      <option value="name">Name</option>
      <option value="lat">Latitude</option>
      <option value="lng">Longitude</option>
      <option value="timezone_id">Timezone</option>
      </select>
    </div>
    <Location_Table input={SearchItems}/>
    </>
  )
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
                    <div lat={item.lat} lng={item.lng}>
                      <img id="pin" src={pin} alt="pin" onClick={() => { window.location.pathname = '/'+item.id; } } />
                    </div>
                  );
            })}
          </GoogleMapReact>
        </div></>
    );
  }
}



function Location_Table(props){
  const [location, setlocation]=useState(location_data)

  let search_field=document.getElementById("search_field").value;
  const matchData = location.filter((items) => {
    if (props.input === '') {
        return items;
    }
    else if(search_field=="region"){
        return items.region.toLowerCase().includes(props.input);
    }
    else if(search_field=="country"){
      return items.country.toLowerCase().includes(props.input);
    }
    else if(search_field=="name"){
      return items.name.toLowerCase().includes(props.input);
    }
    else if(search_field=="lat"){
      return items.lat.toLowerCase().includes(props.input);
    }
    else if(search_field=="lng"){
      return items.lng.toLowerCase().includes(props.input);
    }
    else if(search_field=="timezone_id"){
      return items.timezone_id.toLowerCase().includes(props.input);
    }
})



  
  const [order, setorder]=useState("ASC")
  const sorting=(col)=>{
    if (order==="ASC"){
      const sorted=[...location].sort((a,b)=>
      a[col].toLowerCase()>b[col].toLowerCase()? 1:-1
      );
      setlocation(sorted);
      setorder("DSC");
    }
    if (order==="DSC"){
      const sorted=[...location].sort((a,b)=>
      a[col].toLowerCase()<b[col].toLowerCase()? 1:-1
      );
      setlocation(sorted);
      setorder("ASC");
    }
  }
    return(
    <>
    
        <div className="w-50 " style={{marginLeft:"20vw"}}>
      <Table striped bordered hover>
      <thead>
          <tr>
            <th id="table_title" onClick={()=>sorting("region")}>region</th>
            <th id="table_title" onClick={()=>sorting("country")}>Country</th>
            <th id="table_title" onClick={()=>sorting("name")}>name</th>
            <th id="table_title" onClick={()=>sorting("lat")}>Latitude</th>
            <th id="table_title" onClick={()=>sorting("lat")}>Longitude</th>
            <th id="table_title" onClick={()=>sorting("lng")}>timezone</th>
            <th id="table_title">Weather Information</th>
            <th id="table_title">Add to Favourite</th>
          </tr>
        </thead>
        {matchData.map((item) => {
      return(
        <tbody>
            <tr>
              <td>{item.region}</td>
              <td>{item.country}</td>
              <td>{item.name}</td>
              <td>{item.lat}</td>
              <td>{item.lng}</td>
              <td>{item.timezone_id}</td>
              <td>button</td>
              <td>button</td>
            </tr>
          </tbody>
          );
          })}
    </Table>
    </div>
      
    
    </>
    
    
    )
}




export default Homepage
