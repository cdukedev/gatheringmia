import "./Deliveries.scss";
function Deliveries(props) {
  const recipients = props.recipients;

  const calculateDistance = (centerLocation, recipient) => {
    const { lat, lng } = centerLocation;
    const { lat: recipientLat, lng: recipientLng } = recipient;
    const distance = Math.sqrt(
      Math.pow(lat - recipientLat, 2) + Math.pow(lng - recipientLng, 2)
    );
    return { distance };
  };
  recipients.map((recipient) => {
    let distance = calculateDistance(props.coords, recipient.position);
    //convert the distance to miles and round to 1 decimal places if it is less than 10 miles and round to 0 decimal places if it is greater than or equal to 10 miles
    distance = distance.distance * 69.2;
    if (distance < 10) {
      recipient.distance = Math.round(distance * 10) / 10;
    } else {
      recipient.distance = Math.round(distance);
    }
    //   recipient.distance = distance.distance * 69.2;
    return recipient;
  });

  const sortedrecipients = recipients.sort((a, b) => {
    return a.distance - b.distance;
  });

  return (
    <div className="deliveries__container">
      <h3 className="deliveries__top-row--header">
        Deliver in the order given for the shortest total trip.
      </h3>
      <div className="deliveries__top-row--recipient--container">
        {sortedrecipients.map((recipient) => {
          console.log(recipient.zone);
          console.log(props.zone);
          if (recipient.zone === props.zone) {
            return (
              <div
                className="deliveries__top-row--recipient--radius"
                key={recipient.id}
              >
                <div
                  className="deliveries__top-row--recipient"
                  key={recipient.id}
                >
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
                    <div>
                      <a
                        className="deliveries__top-row--recipient-right--directions"
                        // open in new tab
                        //add an alert that the directions are being opened in a new tab
                        onClick={() => {
                          alert(
                            "Directions are being opened in a new page, you will need to return to this page to continue deliveries."
                          );
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.google.com/maps/dir/?api=1&origin=${props.coords.lat},${props.coords.lng}&destination=${recipient.position.lat},${recipient.position.lng}`}
                      >
                        Get Directions!
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
        <button
          className="top-row-button"
          onClick={() => {
            alert("Thank you for completing your deliveries!");
            props.handleMenuClick("defaultMenu");
          }}
        >
          Click Here to confirm that all deliveries have been completed.
        </button>
      </div>
    </div>
  );
}
export default Deliveries;
