import React, { useContext } from "react";
import styles from "./MapHelp.module.scss";
import MapMenuArrow from "../../../assets/icons/map-menu-arrow.svg";
import FoodBank from "../../../assets/icons/foodbank.svg";
import { MapPageContext } from "../../../contexts/MapPageContext";
import CommunityGarden from "../../../assets/icons/community-garden.svg";
function MapHelp(props) {
  const { handleMenuClick } = useContext(MapPageContext);
  return (
    <div className={styles["map-help__container"]}>
      <div className={styles["map-help__text"]}>
        <div className={styles["map-help__top-row"]}>
          <h2 className={styles["map-help__top-row--header"]}>Map Key</h2>
          <img
            className={styles["map-help__top-row--arrow"]}
            onClick={() => {
              handleMenuClick("defaultMenu");
            }}
            src={MapMenuArrow}
            alt="menu arrow to close helper"
          />
        </div>
        <div className={styles["map-help__bottom-container"]}>
          <div className={styles["map-help__bottom-container--items"]}>
            <img
              className={`${styles["map-help__bottom-container--item"]} ${styles["map-help__bottom-container--item-top"]}`}
              src={FoodBank}
              alt="FoodBank Icon"
            />
            <span className={`${styles["map-help__bottom-container--item-text"]} ${styles["map-help__bottom-container--item-text-top"]}`}>
              Food Pantries
            </span>
          </div>
          <div className={`${styles["map-help__bottom-container--items"]} ${styles["map-help__bottom-container--item-top"]}`}>
            <img
              className={styles["map-help__bottom-container--item"]}
              src={CommunityGarden}
              alt="CommunityGarden Icon"
            />
            <span className={`${styles["map-help__bottom-container--item-text"]} ${styles["map-help__bottom-container--item-text-top"]}`}>
              Gardens
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MapHelp;
