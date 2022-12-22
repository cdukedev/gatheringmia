import "./NavMenu.scss";
import NavButton from "../../../../assets/icons/nav-button.svg";
import { HashLink as Link } from "react-router-hash-link";

function NavMenu(props) {
  if (!props.navMenu) {
    return (
      <div className="nav-menu nav-menu-off">
        <div className="nav-menu__button-container">
          <img
            onClick={props.handleNavMenu}
            className="nav-menu__button"
            src={NavButton}
            alt="nav-button"
          />
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="nav">
          <div className="nav-menu">
            <div
              className="nav-menu__button-container"
              onClick={props.handleNavMenu}
            >
              <img
                className="nav-menu__button"
                src={NavButton}
                alt="nav-button"
              />
            </div>
            <div className="nav-menu__items">
              <Link className="nav-menu__item" to="/map">
                DELIVER FOOD
              </Link>
              <Link className="nav-menu__item" to="/map">
                FIND RESOURCES
              </Link>
              <Link
                className="nav-menu__item"
                smooth
                to="/#AboutUs"
                onClick={props.handleNavMenu}
              >
                ABOUT US
              </Link>
              <Link
                className="nav-menu__item"
                smooth
                to="/#TakePart"
                onClick={props.handleNavMenu}
              >
                GET INVOLVED
              </Link>
              <Link
                className="nav-menu__item"
                smooth
                to="/#NeedHelp"
                onClick={props.handleNavMenu}
              >
                NEED FOOD ASSISTANCE?
              </Link>
              <Link
                className="nav-menu__item"
                smooth
                to="/#contact"
                onClick={props.handleNavMenu}
              >
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default NavMenu;
