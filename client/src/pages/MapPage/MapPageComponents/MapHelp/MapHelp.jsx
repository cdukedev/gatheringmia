import "./MapHelp.scss";
import MapMenuArrow from "../../../../assets/icons/map-menu-arrow.svg";
import FoodBank from "../../../../assets/icons/foodbank.svg";
import CommunityGarden from "../../../../assets/icons/community-garden.svg";
import Home from "../../../../assets/icons/home.svg";
function MapHelp(props) {
  return (
    <div className="map-help__container">
      <div className="map-help__text">
        <div className="map-help__top-row">
          <h2 className="map-help__top-row--header">Map Key</h2>
          <img
            className="map-help__top-row--arrow"
            onClick={() => {
              props.handleMenuClick("defaultMenu");
            }}
            src={MapMenuArrow}
            alt="menu arrow to close helper"
          />
        </div>
        <div className="map-help__bottom-container">
          <div className="map-help__bottom-container--items">
            <img
              className="map-help__bottom-container--item map-help__bottom-container--item-top"
              src={FoodBank}
              alt="FoodBank Icon"
            />
            <span className="map-help__bottom-container--item-text map-help__bottom-container--item-text-top">
              Food Pantries
            </span>
          </div>
          <div className="map-help__bottom-container--items map-help__bottom-container--item-top">
            <img
              className="map-help__bottom-container--item"
              src={CommunityGarden}
              alt="CommunityGarden Icon"
            />
            <span className="map-help__bottom-container--item-text map-help__bottom-container--item-text-top">
              Gardens
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MapHelp;
