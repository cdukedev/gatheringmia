import React, { useContext } from "react";
import styles from "./FoodBankChoice.module.scss";
import MapMenuArrow from "../../../assets/icons/map-menu-arrow.svg";
import { MapPageContext } from "../../../contexts/MapPageContext";
import { GeolocationContext } from "../../../contexts/GeolocationContext";
import { RecipientContext } from "../../../contexts/RecipientContext";
import { FoodBankContext } from "../../../contexts/FoodBankContext";
import { useRouter } from "next/router";

function FoodBankChoice() {
  const { handleMenuClick } = useContext(MapPageContext);
  const { coords } = useContext(GeolocationContext); // Consume GeolocationContext
  const { foodBanks } = useContext(FoodBankContext); // Consume FoodBankContext
  const { handleDeliveryClick } = useContext(RecipientContext);

  const router = useRouter();

  const calculateDistance = (centerLocation, foodBank) => {
    const { lat, lng } = centerLocation;
    const { lat: foodBankLat, lng: foodBankLng } = foodBank;
    const distance = Math.sqrt(
      Math.pow(lat - foodBankLat, 2) + Math.pow(lng - foodBankLng, 2)
    );
    return { distance };
  };

  foodBanks.map((foodBank) => {
    if (coords) {
      let distance = calculateDistance(coords, foodBank.position);
      distance = distance.distance * 69.2;
      if (distance < 10) {
        foodBank.distance = Math.round(distance * 10) / 10;
      } else {
        foodBank.distance = Math.round(distance);
      }
    } else {
      foodBank.distance = undefined;
    }
    return foodBank;
  });

  const sortedFoodBanks = foodBanks.sort((a, b) => {
    return a.distance - b.distance;
  });

  return (
    <div className={styles["map-deliveries__container"]}>
      <div className={styles["map-deliveries__top-row"]}>
        <img
          className={styles["map-deliveries__top-row--arrow"]}
          onClick={() => {
            handleMenuClick("defaultMenu");
          }}
          src={MapMenuArrow}
          alt="menu arrow to close helper"
        />
      </div>
      <h3 className={styles["map-deliveries__top-row--header"]}>
        Select a location to begin delivering
      </h3>
      <div className={styles["map-deliveries__top-row--food-bank--container"]}>
        {sortedFoodBanks.map((foodBank) => {
          return (
            <div
              className={styles["map-deliveries__top-row--food-bank--radius"]}
              key={foodBank.id}
            >
              <div
                className={styles["map-deliveries__top-row--food-bank"]}
                key={foodBank.id}
              >
                <div className={styles["map-deliveries__top-row--food-bank-left"]}>
                  <div className={`${styles["map-deliveries__top-row--food-bank--item"]} ${styles["map-deliveries__top-row--food-bank-left--name"]}`}>
                    {foodBank.name}
                  </div>
                  <div className={`${styles["map-deliveries__top-row--food-bank--item"]} ${styles["map-deliveries__top-row--food-bank-left--address"]}`}>
                    {foodBank.address}
                  </div>
                  <div className={`${styles["map-deliveries__top-row--food-bank--item"]} ${styles["map-deliveries__top-row--food-bank-left--phone"]}`}>
                    {foodBank.phone}
                  </div>
                </div>
                <div className={styles["map-deliveries__top-row--food-bank-right"]}>
                  <div className={`${styles["map-deliveries__top-row--food-bank--item"]} ${styles["map-deliveries__top-row--food-bank-right--distance"]}`}>
                    {foodBank.distance
                      ? `${foodBank.distance} miles`
                      : "Loading..."}
                  </div>
                  <div>
                    <button
                      className={styles["map-deliveries__top-row--food-bank-right--directions"]}
                      onClick={() => {
                        handleDeliveryClick("qrScanner", foodBank.zone);
                        router.push(
                          `/directions/${coords.lat}/${coords.lng}/${foodBank.position.lat}/${foodBank.position.lng}`
                        );
                      }}
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FoodBankChoice;
