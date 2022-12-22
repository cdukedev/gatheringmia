import Logo from "../../../../assets/logo/desktop-logo.png";
import QRCode from "../../../../assets/icons/desktop_qr.png";
import "./Desktop.scss";

function Desktop() {
  return (
    <div className="desktop">
      <div className="desktop-logo__container">
        <img className="desktop-logo" src={Logo} alt="logo" />
      </div>
      <div className="desktop-content__container">
        <p className="desktop-content">
          We are excited to have you join us! This site is intented for mobile
          use. Please scan the QR code to navigate to our site on your mobile
          device.
        </p>
        <div>
          <img
            className="desktop-qr"
            src={QRCode}
            alt="gathering website QR Code"
          />
        </div>
        <span className="desktop-content">
          You may also type gathering-mia.live into your favorite mobile
          browser.
        </span>
      </div>
    </div>
  );
}

export default Desktop;
