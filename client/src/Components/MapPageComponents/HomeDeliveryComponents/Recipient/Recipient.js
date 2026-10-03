import React, { useContext } from "react";
import { useRouter } from "next/router";
import { RecipientContext } from "../../../../contexts/RecipientContext";

function Recipient({ recipient, coords }) {
  const router = useRouter();
  const { setCurrentRecipient } = useContext(RecipientContext);

  const handleRecipientClick = (e) => {
    console.log("recipient clicked");
    setCurrentRecipient(recipient);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${recipient.position.lat},${recipient.position.lng}&travelmode=driving`;

    if (isMobile) {
      // On mobile devices, just navigate to the URL, don't open a new tab
      window.location.href = mapsUrl;
    } else {
      // On non-mobile devices, open a new tab
      window.open(mapsUrl, "_blank");
    }

    router.push(
      `/directions/${coords.lat}/${coords.lng}/${recipient.position.lat}/${recipient.position.lng}`
    );
  };

  return (
    <div className="deliveries__top-row--recipient--radius" key={recipient.id}>
      <div className="deliveries__top-row--recipient">
        <div className="deliveries__top-row--recipient-left">
          <div className="deliveries__top-row--recipient--item deliveries__top-row--recipient-left--name">
            {recipient.name}
          </div>
          <div className="deliveries__top-row--recipient--item deliveries__top-row--recipient-left--address">
            {recipient.address}
          </div>
          <div className="deliveries__top-row--recipient--item deliveries__top-row--recipient-left--phone">
            {recipient.phone}
          </div>
        </div>
        <div className="deliveries__top-row--recipient-right">
          <div className="deliveries__top-row--recipient--item deliveries__top-row--recipient-right--distance">
            {recipient.distance} miles
          </div>
          <div
            className="deliveries__top-row--recipient-right--directions"
            onClick={handleRecipientClick}
          >
            Get Directions
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recipient;
