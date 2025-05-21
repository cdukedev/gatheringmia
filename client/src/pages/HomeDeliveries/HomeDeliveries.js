import React, { useEffect, useContext, useState } from "react";
import "./HomeDeliveries.scss";
import { useRouter } from "next/router";
import { RecipientContext } from "../../contexts/RecipientContext";
import { GeolocationContext } from "../../contexts/GeolocationContext";
import HomeDeliveriesSplash from "./HomeDeliveriesSplash";
import RecipientsList from "../../Components/MapPageComponents/HomeDeliveryComponents/RecipientsList/RecipientsList";
import { findOptimalPath } from "../../utils/pathFinding";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomeDeliveries() {
  // State
  const [finalDestination, setFinalDestination] = useState({
    lat: 24.2801423,
    lng: -80.6620736,
  }); // Plans: In the future, the finalDestination will be set by the user prior to making their deliveries, their destination will be stored so that when they log in, their destination can be loaded as the default.

  const [deliveryCapacity, setDeliveryCapacity] = useState(5); // Plans: In the future, the capacity will be set by the user in their profile.

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Context
  const { handleGeolocationRequest, coords } = useContext(GeolocationContext);
  const {
    recipients,
    currentRecipient,
    loadingRecipients,
    sortedRecipients,
    setSortedRecipients,
    setCurrentRecipient,
  } = useContext(RecipientContext);

  const zone = 2;

  useEffect(() => {
    const fetchCoords = async () => {
      await handleGeolocationRequest();
    };
    fetchCoords();
  }, [handleGeolocationRequest]);

  useEffect(() => {
    // If a current recipient is selected or there are no sorted recipients, stop loading
    if (currentRecipient || sortedRecipients.length === 0) {
      setLoading(false);
    }
    // If recipients are not loading and there is no current recipient, find optimal path
    if (!loadingRecipients && !currentRecipient) {
      const newRecipients = findOptimalPath(
        recipients,
        coords,
        {
          lat: 24.2801423,
          lng: -80.6620736,
        },
        deliveryCapacity,
        zone
      );
      setSortedRecipients(newRecipients);
      setLoading(false);
    }
  }, [recipients, loadingRecipients]);

  // Function to handle finished delivery click
  const handleFinishedDeliveryClick = (clicked, clickedZone) => {
    setSortedRecipients([]);
    setLoading(true);
    setCurrentRecipient(null);
    router.push("/");
  };

  if (currentRecipient && !sortedRecipients.length) {
    return (
      <div className="amazing__container">
        <button
          className="top-row-button"
          onClick={handleFinishedDeliveryClick}
        >
          <p className="top-row-button--text">
            Thank you so much on behalf of those in our community for delivering
            today! Click Here to confirm that all deliveries have been
            completed.
          </p>
        </button>
        <img
          className="amazing__container-image"
          src="https://i.imgur.com/RdppHIt.jpg"
          alt=""
        />
      </div>
    );
  }

  if (loadingRecipients || loading || !coords || !sortedRecipients.length) {
    return <HomeDeliveriesSplash />;
  } else {
    return (
      <div className="deliveries__container">
        <ToastContainer />
        <h3 className="deliveries__top-row--header">
          Deliver in the order given for the shortest total trip.
        </h3>
        <div className="deliveries__top-row--recipient--container">
          <RecipientsList coords={coords} />
        </div>
      </div>
    );
  }
}

export default HomeDeliveries;
