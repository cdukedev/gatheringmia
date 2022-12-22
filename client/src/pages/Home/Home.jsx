import "./Home.scss";
import NavMenu from "./HomeComponents/NavMenu/NavMenu";
import Footer from "./HomeComponents/Footer/Footer";
import Gallery from "./HomeComponents/Gallery/Gallery";
import AboutUs from "./HomeComponents/AboutUs/AboutUs";
import Logo from "../../assets/logo/logo.svg";
import React from "react";
import TakePart from "./HomeComponents/TakePart/TakePart";
import NeedHelp from "./HomeComponents/NeedHelp/NeedHelp";
import Desktop from "./HomeComponents/Desktop/Desktop";

class Home extends React.Component {
  state = {
    navMenu: false,
  };
  handleNavMenu = () => {
    this.setState({
      navMenu: !this.state.navMenu,
    });
  };
  render() {
    if (window.innerWidth > 680) {
      return <Desktop />;
    } else {
      return (
        <div className="home" data-test="home">
          <NavMenu
            navMenu={this.state.navMenu}
            handleNavMenu={this.handleNavMenu}
          />
          <img className="home__logo" src={Logo} alt="logo" />
          <Gallery />

          <hr className="home__hr" />
          <AboutUs />
          <TakePart />
          <NeedHelp />
          <Footer />
        </div>
      );
    }
  }
}
export default Home;
