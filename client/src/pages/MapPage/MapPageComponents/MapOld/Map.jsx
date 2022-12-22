import React from "react";
import GoogleMapReact from "google-map-react";
import "./Map.scss";
const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function Map(props) {
  const defaultProps = {
    center: {
      lat: props.coords.lat,
      lng: props.coords.lng,
    },
    zoom: 13.5,
  };
  const waterStyle = [
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#4BB4F5",
        },
      ],
    },
  ];

  return (
    <>
      <div className="map">
        <GoogleMapReact
          bootstrapURLKeys="AIzaSyAKz9XRYO7HY9xqFCvqDgEOBc6r1jeoKUg"
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          options={{
            styles: waterStyle,
            disableDefaultUI: true,
          }}
        ></GoogleMapReact>
      </div>
    </>
  );
}
