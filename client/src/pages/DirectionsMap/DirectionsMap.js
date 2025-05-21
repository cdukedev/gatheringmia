import React, { useState, useRef, useEffect, useContext } from "react";
import styles from "./DirectionsMap.module.scss";
import Link from "next/link";
import { useNextNavigation } from "../../utils/navigation";
import { RecipientContext } from "../../contexts/RecipientContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import dynamic from 'next/dynamic';

// Import dynamic Google Maps components with SSR disabled
const GoogleMapComponent = dynamic(
  () => import('@react-google-maps/api').then(module => module.GoogleMap),
  { ssr: false }
);

const LoadScriptComponent = dynamic(
  () => import('@react-google-maps/api').then(module => module.LoadScript),
  { ssr: false }
);

const DirectionsRendererComponent = dynamic(
  () => import('@react-google-maps/api').then(module => module.DirectionsRenderer),
  { ssr: false }
);

const MarkerComponent = dynamic(
  () => import('@react-google-maps/api').then(module => module.Marker),
  { ssr: false }
);

// *****************************************************
// NEED TO REFACTOR THIS PAGE AND PUT UTILS INTO A SEPARATE FILE
// *****************************************************

const DirectionsMap = ({ userLat, userLng, destinationLat, destinationLng }) => {
  const { navigate } = useNextNavigation();
  const { sortedRecipients, setSortedRecipients, currentRecipient } =
    useContext(RecipientContext);
  const [hasCallbackRun, setHasCallbackRun] = useState(false);
  const center = {
    lat: parseFloat(userLat),
    lng: parseFloat(userLng),
  };
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const [userPosition, setUserPosition] = useState(center);
  const [carMarker, setCarMarker] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [directionText, setDirectionText] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const google = window.google;

  const mapRef = useRef(null);

  useEffect(() => {
    // Check if mapRef exists and directions have not been fetched yet
    if (mapRef.current && !directions) {
      // Create a request object with origin, destination, and travel mode
      const request = {
        origin: center, // @params center: string - The coordinates of the map's center
        destination: {
          lat: parseFloat(destinationLat), // @params destinationLat: string - The latitude of the destination
          lng: parseFloat(destinationLng), // @params destinationLng: string - The longitude of the destination
        },
        travelMode: "DRIVING", // Set travel mode to driving
      };
      // Use Google Maps DirectionsService to fetch directions based on the request
      new google.maps.DirectionsService().route(request, directionsCallback);
      // @stateChange directions: object - The fetched directions object
    }
  }, [directions, center, destinationLat, destinationLng]); // @dependencies directions, center, destinationLat, destinationLng

  useEffect(() => {
    // Check if mapRef exists and watchId has not been set yet
    if (mapRef.current && !watchId) {
      // Watch position using the Geolocation API
      const id = navigator.geolocation.watchPosition(
        handleGeolocationUpdate, // @params handleGeolocationUpdate: function - Callback function to handle geolocation updates
        (error) => console.error(error), // Error callback function
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 } // Options object for watchPosition
      );
      // Set the watchId state variable with the obtained id
      setWatchId(id);
      // @stateChange watchId: number - The id returned by the watchPosition method
    }
  }, [watchId]); // @dependencies watchId

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    fullscreenControl: false,
    mapTypeId: "roadmap", // Use the hybrid map type for more detailed visuals
  };

  /**
   * Handles the click event for delivery.
   * Removes the first recipient from the sortedRecipients array, sets the updated array as the new state value,
   * resets currentStepIndex and directions state values, and navigates to the "/deliveries" route.
   *
   * @returns {void}
   * @stateChange Modifies the sortedRecipients, currentStepIndex, and directions state values.
   * @dependencies sortedRecipients, setCurrentStepIndex, setDirections, navigate
   */
  const handleDeliveryClick = () => {
    // Create a copy of the sortedRecipients array
    const newRecipients = [...sortedRecipients];

    // Remove the first recipient from the newRecipients array
    newRecipients.shift();

    // Update the sortedRecipients state with the new array
    setSortedRecipients(newRecipients);

    // Reset the currentStepIndex state to 0
    setCurrentStepIndex(0);

    // Reset the directions state to null
    setDirections(null);

    // Navigate to the "/deliveries" route
    navigate("/deliveries");
  };

  /**
   * Calculates the haversine distance between two sets of latitude and longitude coordinates.
   *
   * @param {number} lat1 - The latitude of the first coordinate.
   * @param {number} lon1 - The longitude of the first coordinate.
   * @param {number} lat2 - The latitude of the second coordinate.
   * @param {number} lon2 - The longitude of the second coordinate.
   * @returns {number} The haversine distance in miles.
   */
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    // Mean radius of the Earth in miles
    const R = 3958.8;

    // Calculate the differences in latitude and longitude in radians
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    // Calculate the haversine formula components
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    // Calculate the central angle using the haversine formula
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the haversine distance
    const d = R * c;

    return d;
  };

  /**
   * Updates the car marker on the map to the specified position.
   *
   * @param {google.maps.LatLng} position - The new position for the car marker.
   * @stateChange {carMarker} - The state variable representing the car marker.
   * @dependencies google, google.maps.LatLng, google.maps.Marker, google.maps.Size
   */
  const updateCarMarker = (position) => {
    if (carMarker) {
      // If a car marker already exists, update its position
      carMarker.setPosition(position);
    } else {
      // If no car marker exists, create a new one and set it as the car marker
      const newMarker = new google.maps.Marker({
        position,
        map: mapRef.current,
        icon: {
          url: "https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png",
          scaledSize: new google.maps.Size(20, 20),
          anchor: { x: 10, y: 10 },
        },
      });
      setCarMarker(newMarker);
    }

    // Update the user position with the new position
    setUserPosition(position);
  };

  /**
   * Handles the geolocation update and performs necessary actions based on the new position.
   *
   * @param {Position} position - The updated geolocation position.
   * @stateChange {carMarker, currentStepIndex} - The state variables representing the car marker and current step index.
   * @dependencies updateCarMarker, directions, currentStepIndex, haversineDistance, speakDirections
   */
  const handleGeolocationUpdate = (position) => {
    const newPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    console.log("New position:", newPosition); // Log the new position

    updateCarMarker(newPosition);

    if (directions) {
      if (currentStepIndex < directions.routes[0].legs[0].steps.length) {
        const nextStep = directions.routes[0].legs[0].steps[currentStepIndex];
        const distanceToNextStep = haversineDistance(
          newPosition.lat,
          newPosition.lng,
          nextStep.start_location.lat(),
          nextStep.start_location.lng()
        );

        console.log(
          "Next step start location:",
          nextStep.start_location.toJSON()
        ); // Log the next step start location

        if (distanceToNextStep < 0.0378788) {
          // Determine if the car is close enough to the next step (within 200 feet)
          speakDirections(nextStep.instructions);
          setCurrentStepIndex(currentStepIndex + 1);
        }
      }
    }
  };

  /**
   * Speaks the given text as directions using the SpeechSynthesis API.
   *
   * @param {string} text - The text to be spoken as directions.
   * @stateChange {directionText, timeoutId} - The state variables representing the direction text and timeout ID.
   * @dependencies window.speechSynthesis, clearTimeout, setDirectionText
   * @returns {void}
   */
  const speakDirections = (text) => {
    if ("speechSynthesis" in window) {
      const cleanText = text.replace(/<[^>]*>?/gm, ""); // Remove any HTML tags

      const synth = window.speechSynthesis;
      console.log("Speaking direction:", cleanText); // Log the spoken direction

      const utterance = new SpeechSynthesisUtterance(cleanText);
      synth.speak(utterance);

      // Set the direction text and remove it after 8 seconds
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setDirectionText(cleanText);

      const id = setTimeout(() => {
        setDirectionText("");
      }, 8000);

      setTimeoutId(id);
    } else {
      console.error(
        "Text-to-speech is not supported in this browser or device"
      );
    }
  };

  /**
   * Callback function for directions response.
   *
   * @param {Object} response - The response object containing direction information.
   * @param {string} status - The status of the direction request.
   * @returns {void}
   * @stateChange Sets directions, directionText, setTimeoutId.
   * @dependencies Uses sortedRecipients, setSortedRecipients, navigate, toast, setError, speakDirections.
   */
  const directionsCallback = (response, status) => {
    if (hasCallbackRun) return;

    // Handle error conditions
    if (status !== "OK") {
      console.error(`Error fetching directions: ${status}`);

      if (status === "ZERO_RESULTS") {
        // Display error message and handle recipient removal
        toast.error(
          "We apologize for the inconvenience, we were unable to locate a route. Our team has been notified and is currently working on a solution. In the meantime, please don't worry about returning the food. Thank you for your understanding.",
          { autoClose: 13000 }
        );
        const newRecipients = [...sortedRecipients];
        newRecipients.shift();
        setSortedRecipients(newRecipients);

        // Navigate back to deliveries page
        navigate("/deliveries");
      } else {
        // Set error message
        setError(`Error fetching directions: ${status}`);
      }

      // Set hasCallbackRun flag and return
      setHasCallbackRun(true);
      return;
    }

    // Set directions
    setDirections(response);
    const firstStep = response.routes[0].legs[0].steps[0].instructions;
    const rawInitialMessage = `We greatly appreciate your time to deliver today. Allow me to help you find your way. ${firstStep}`;
    const initialMessage = rawInitialMessage.replace(/<[^>]*>?/gm, "");

    // Set direction text
    setDirectionText(initialMessage);

    // Set timeout for clearing direction text
    const id = setTimeout(() => {
      setDirectionText("");
    }, 8000);
    setTimeoutId(id);

    // Speak directions if not already speaking
    if (!window.speechSynthesis.speaking) {
      speakDirections(initialMessage);
    }
  };

  /**
   * Function to handle the map load event.
   *
   * @param {Object} map - The map object.
   * @returns {void}
   * @stateChange Sets watchId.
   * @dependencies Uses mapRef, navigator.geolocation, handleGeolocationUpdate, console.error.
   */
  const handleMapLoad = (map) => {
    // Set the map reference
    mapRef.current = map;

    // Check if geolocation tracking is already active
    if (!watchId) {
      // Start geolocation tracking
      const id = navigator.geolocation.watchPosition(
        handleGeolocationUpdate,
        (error) => console.error(error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
      setWatchId(id);
    }

    // Increase the zoom level of the map
    map.setZoom(18);
  };

  /**
   * Render the DirectionsMap component.
   *
   * @returns {JSX.Element} - The rendered React component.
   * @stateChange None.
   * @dependencies Uses userLat, userLng, destinationLat, destinationLng, error, process.env.REACT_APP_GOOGLE_API_KEY, LoadScript, GoogleMap, containerStyle, mapOptions, handleMapLoad, directions, DirectionsRenderer, Marker, userPosition, directionText, currentRecipient, handleDeliveryClick, Link.
   */
  // Check if any location parameters are missing
  if (!userLat || !userLng || !destinationLat || !destinationLng) {
    return <div>Error: Missing location parameters</div>;
  }
  // Check if there is an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <LoadScriptComponent googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <GoogleMapComponent
        mapContainerStyle={containerStyle}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {directions && (
          <DirectionsRendererComponent
            options={{
              directions,
              suppressMarkers: true,
            }}
          />
        )}
        <MarkerComponent
          position={{
            lat: parseFloat(destinationLat),
            lng: parseFloat(destinationLng),
          }}
        />
        {directions && (
          <MarkerComponent
            position={userPosition}
            icon={{
              url: "https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png",
              scaledSize: new window.google.maps.Size(20, 20),
              anchor: new window.google.maps.Point(10, 10),
            }}
          />
        )}
      </GoogleMapComponent>
      {directionText && (
        <div className={`${styles["direction-box"]} ${!directionText ? styles.fadeOut : ""}`}>
          {directionText}
        </div>
      )}
      {/* if current recipient is truthy call the handleDeliveryClick otherwise link to the delivery page */}
      {currentRecipient && (
        <button
          className={styles["arrived-button"]}
          onClick={() => handleDeliveryClick()}
        >
          Delivery Successful
        </button>
      )}
      {!currentRecipient && (
        <Link href="/deliver">
          <button className={styles["arrived-button"]}>Arrived</button>
        </Link>
      )}
    </LoadScript>
  );
};

export default DirectionsMap;
