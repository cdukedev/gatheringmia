import React, { useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import foodBank from "../../../../assets/icons/foodbank.svg";
import communityGarden from "../../../../assets/icons/community-garden.svg";

const Map = (props) => {
  const initialMarkers = props.initialMarkers;
  const [activeInfoWindow, setActiveInfoWindow] = useState("");
  const [markers] = useState(initialMarkers);
  const [center] = useState({
    lat: props.coords.lat,
    lng: props.coords.lng,
  });
  const containerStyle = {
    width: "100vw",
    height: `${props.height}`,
  };

  const createMapOptions = {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
  };

  const markerClicked = (index) => {
    setActiveInfoWindow(index);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={createMapOptions}
        center={center}
        zoom={13}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            // position will be displayed if the filter toggle is true
            position={
              marker.type === "Food Bank" && props.foodBankToggle
                ? marker.position
                : marker.type === "Community Garden" &&
                  props.communityGardenToggle
                ? marker.position
                : null
            }
            //set icon to foodbank image if name is foodbank
            // else set icon to home image if name is home
            // else set icon to community garden image if name is community garden
            icon={
              marker.type === "Food Bank"
                ? foodBank
                : marker.type === "Community Garden"
                ? communityGarden
                : null
            }
            onClick={() => markerClicked(index)}
          >
            {activeInfoWindow === index && (
              <InfoWindow position={marker.position}>
                <b>
                  {marker.name}
                  <br />
                  {marker.address}
                  <br />
                  {marker.phone}
                  <br />
                  {marker.type}
                </b>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
