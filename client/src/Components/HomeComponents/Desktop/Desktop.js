import React from "react";
import Logo from "../../../assets/logo/desktop-logo.png";
import QRCode from "../../../assets/icons/desktop_qr.png";

import styles from "./Desktop.module.scss";

function Desktop() {
  return (
    <div className={styles.desktop}>
      <div className={styles["desktop-logo__container"]}>
        <img className={styles["desktop-logo"]} src={Logo} alt="logo" />
      </div>
      <div className={styles["desktop-content__container"]}>
        <p className={styles["desktop-content"]}>
          We are excited to have you join us! This site is intended for mobile
          use. Please scan the QR code to navigate to our site on your mobile
          device.
        </p>
        <div>
          <img
            className={styles["desktop-qr"]}
            src={QRCode}
            alt="gathering website QR Code"
          />
        </div>
        <span className={styles["desktop-content"]}>
          You may also type gathering-mia.live into your favorite mobile
          browser.
        </span>
      </div>
    </div>
  );
}

export default Desktop;
