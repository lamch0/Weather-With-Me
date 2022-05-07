import React from "react";
import {Map, GoogleApiWrapper} from 'google-map-react'

class Mapcontainer extends Component{
    render(){
      return(
        <Map
          google={this.props.google}
          style={{width:"100%",height:"100%"}}
          zoom={10}
          initialCenter={
            {
              lat:28,
              lng:77
            }
          }
        />
      )
    }
  }

  export default GoogleApiWrapper({
    apiKey: 'AIzaSyDNzUJieo8rD3mAG5ZgZD7dZPEMUeMUuSI'
  })(Mapcontainer)