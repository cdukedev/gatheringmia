import React, { useContext } from "react";
import "./MapMenu.scss";
import homeButton from "../../../assets/icons/map-home.svg";
import helpButton from "../../../assets/icons/map-help.svg";
import filterButton from "../../../assets/icons/map-filter.svg";
import searchButton from "../../../assets/icons/map-deliveries.svg";
import { MapPageContext } from "../../../contexts/MapPageContext";
import Link from "next/link";

function MapMenu() {
  const { handleMenuClick } = useContext(MapPageContext);
  return (
    <div className="map-menu__container">
      <div className="map-menu__buttons">
        <Link href="/">
          <img src={homeButton} alt="home button" />
        </Link>
        <img
          onClick={() => {
            handleMenuClick("mapHelp");
          }}
          src={helpButton}
          alt="help button"
        />
        <img
          onClick={() => {
            handleMenuClick("mapFilter");
          }}
          src={filterButton}
          alt="filter button"
        />
        <img
          onClick={() => {
            handleMenuClick("FoodBankChoice");
          }}
          src={searchButton}
          alt="search button"
        />
      </div>
    </div>
  );
}
export default MapMenu;
