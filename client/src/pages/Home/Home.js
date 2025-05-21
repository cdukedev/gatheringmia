import React, { useState } from "react";
import styles from "./Home.module.scss";
import NavMenu from "../../Components/HomeComponents/NavMenu/NavMenu";
import Footer from "../../Components/HomeComponents/Footer/Footer";
import Gallery from "../../Components/HomeComponents/Gallery/Gallery";
import AboutUs from "../../Components/HomeComponents/AboutUs/AboutUs";
import Logo from "../../assets/logo/logo.svg";
import TakePart from "../../Components/HomeComponents/TakePart/TakePart";
import NeedHelp from "../../Components/HomeComponents/NeedHelp/NeedHelp";
import Desktop from "../../Components/HomeComponents/Desktop/Desktop";

function Home() {
  const [navMenu, setNavMenu] = useState(false);
  const handleNavMenu = () => {
    setNavMenu(!navMenu);
  };
  if (window.innerWidth > 680) {
    return <Desktop />;
  } else {
    return (
      <div className={styles.home} data-test="home">
        <NavMenu navMenu={navMenu} handleNavMenu={handleNavMenu} />
        <img className={styles.home__logo} src={Logo} alt="logo" />
        <Gallery />

        <hr className={styles.home__hr} />
        <AboutUs />
        <TakePart />
        <NeedHelp />
        <Footer />
      </div>
    );
  }
}
export default Home;
