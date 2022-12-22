import React from 'react';
import './MapDeliveries.scss';
import MapMenuArrow from '../../../../assets/icons/map-menu-arrow.svg';

function MapDeliveries(props) {
  const { foodBanks } = props;

  const calculateDistance = (centerLocation, foodBank) => {
    const { lat, lng } = centerLocation;
    const { lat: foodBankLat, lng: foodBankLng } = foodBank;
    const distance = Math.sqrt(
      (lat - foodBankLat) ** 2 + (lng - foodBankLng) ** 2,
    );
    return { distance };
  };

  foodBanks.map((foodBank) => {
    let distance = calculateDistance(props.coords, foodBank.position);
    // convert the distance to miles and round to 1 decimal places if it is less 10 miles and round
    distance = distance.distance * 69.2;
    if (distance < 10) {
      foodBank.distance = Math.round(distance * 10) / 10;
    } else {
      foodBank.distance = Math.round(distance);
    }
    //   foodBank.distance = distance.distance * 69.2;
    return foodBank;
  });

  const sortedFoodBanks = foodBanks.sort((a, b) => a.distance - b.distance);

  return (
    <div className="map-deliveries__container">
      <div className="map-deliveries__top-row">
        <img
          className="map-deliveries__top-row--arrow"
          onClick={() => {
            props.handleMenuClick('defaultMenu');
          }}
          src={MapMenuArrow}
          alt="menu arrow to close helper"
        />
      </div>
      <h3 className="map-deliveries__top-row--header">
        Select a location to begin delivering
      </h3>
      {/* map sorted food bank in a div, left side with name, with distance and hget driections */}
      <div className="map-deliveries__top-row--food-bank--container">
        {sortedFoodBanks.map((foodBank) => (
          <div
            className="map-deliveries__top-row--food-bank--radius"
            key={foodBank.id}
          >
            <div
              className="map-deliveries__top-row--food-bank"
              key={foodBank.id}
            >
              <div className="map-deliveries__top-row--food-bank-left">
                <div className="map-deliveries__top-row--food-bank--item map-deliveries__top-row--food-bank-left--name">
                  {foodBank.name}
                </div>
                <div className="map-deliveries__top-row--food-bank--item map-deliveries__top-row--food-bank-left--address">
                  {foodBank.address}
                </div>
                <div className="map-deliveries__top-row--food-bank--item map-deliveries__top-row--food-bank-left--phone">
                  {foodBank.phone}
                </div>
              </div>
              <div className="map-deliveries__top-row--food-bank-right">
                <div className="map-deliveries__top-row--food-bank--item map-deliveries__top-row--food-bank-right--distance">
                  {foodBank.distance}
                  {' '}
                  miles
                </div>
                <div>
                  <a
                    className="map-deliveries__top-row--food-bank-right--directions"
                      // open in new tab
                      // add an alert that the directions are being opened in a new tab
                    onClick={() => {
                      console.log('directions clicked');
                      console.log(foodBank.zone);
                      alert('Directions are being opened in new page, need to return to this page once you have arrived');
                      props.handleDeliveryClick('qrScanner', foodBank.zone);
                    }}
                    zone={foodBank.zone}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.com/maps/dir/?api=1&origin=${props.coords.lat},${props.coords.lng}&destination=${foodBank.position.lat},${foodBank.position.lng}`}
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MapDeliveries;
