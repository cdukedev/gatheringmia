import React, { useContext } from "react";
import styles from "./MapFilter.module.scss";
import MapMenuArrow from "../../../assets/icons/map-menu-arrow.svg";
import FilterOn from "../../../assets/icons/filter-on.svg";
import FilterOff from "../../../assets/icons/filter-off.svg";
import { MapPageContext } from "../../../contexts/MapPageContext";
import { CommunityGardenContext } from "../../../contexts/CommunityGardenContext";
import { FoodBankContext } from "../../../contexts/FoodBankContext";

function MapFilter() {
  const { handleMenuClick } = useContext(MapPageContext);
  const { communityGardenToggle, handleCommunityGardenToggle } = useContext(
    CommunityGardenContext
  );
  const { foodBankToggle, handleFoodBankToggle } = useContext(FoodBankContext);

  return (
    <div className={styles["map-filter__container"]}>
      <div className={styles["map-filter__text"]}>
        <div className={styles["map-filter__top-row"]}>
          <img
            className={styles["map-filter__top-row--arrow"]}
            onClick={() => {
              handleMenuClick("defaultMenu");
            }}
            src={MapMenuArrow}
            alt="menu arrow to close helper"
          />
        </div>
        <div className={styles["map-filter__bottom-container"]}>
          <div
            className={
              foodBankToggle
                ? styles["map-filter__bottom-container--items"]
                : `${styles["map-filter__bottom-container--items"]} ${styles["map-filter__bottom-container--items-off"]}`
            }
            onClick={() => {
              handleFoodBankToggle();
            }}
          >
            <span className={styles["map-filter__bottom-container--item-text"]}>
              Food Pantries
            </span>
            <img
              className={styles["map-filter__bottom-container--item"]}
              src={foodBankToggle ? FilterOn : FilterOff}
              alt="FoodBank Icon"
            />
          </div>
          <div
            className={
              communityGardenToggle
                ? styles["map-filter__bottom-container--items"]
                : `${styles["map-filter__bottom-container--items"]} ${styles["map-filter__bottom-container--items-off"]}`
            }
            onClick={() => {
              handleCommunityGardenToggle();
            }}
          >
            <span className={styles["map-filter__bottom-container--item-text"]}>
              Gardens
            </span>
            <img
              className={styles["map-filter__bottom-container--item"]}
              src={communityGardenToggle ? FilterOn : FilterOff}
              alt="CommunityGarden Icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapFilter;

export default MapFilter;
