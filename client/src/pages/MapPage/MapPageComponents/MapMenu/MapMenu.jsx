import "./MapMenu.scss";
import homeButton from "../../../../assets/icons/map-home.svg";
import helpButton from "../../../../assets/icons/map-help.svg";
import filterButton from "../../../../assets/icons/map-filter.svg";
import searchButton from "../../../../assets/icons/map-deliveries.svg";
import { Link } from "react-router-dom";

function MapMenu(props) {
  return (
    <div className="map-menu__container">
      <div className="map-menu__buttons">
        <Link to="./">
          <img src={homeButton} alt="home button" />
        </Link>
        <img
          onClick={() => {
            props.handleMenuClick("mapHelp");
          }}
          src={helpButton}
          alt="help button"
        />
        <img
          onClick={() => {
            props.handleMenuClick("mapFilter");
          }}
          src={filterButton}
          alt="filter button"
        />
        <img
          onClick={() => {
            props.handleMenuClick("mapDeliveries");
          }}
          src={searchButton}
          alt="search button"
        />
      </div>
    </div>
  );
}
export default MapMenu;
