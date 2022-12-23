import React from 'react';
import './Splash.scss';
import splash from '../../assets/images/splash.svg';

function Splash() {
  return (
    <>
      <img className="splash" src={splash} alt="splash screen" />
      <div className="container">
        <div className="animation-wrapper">
          <div id="img1" className="img" />
          <div id="img2" className="img" />
          <div id="img3" className="img" />
          <div id="img4" className="img" />
          <div id="img5" className="img" />
          <div id="img6" className="img" />
          <div id="img7" className="img" />
          <div id="img8" className="img" />
          <div id="img9" className="img" />
        </div>
      </div>
    </>
  );
}
export default Splash;
