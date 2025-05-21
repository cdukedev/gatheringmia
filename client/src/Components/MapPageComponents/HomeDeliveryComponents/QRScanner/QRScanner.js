import React from "react";
import Link from "next/link";
import QRScannerImage from "../../../../assets/images/qr-scanner-image.png";
import styles from "./QRScanner.module.scss";
import BackButton from "../../../../Components/BackButton/BackButton.js";

function QRScanner() {
  // Destructure the context value to get handleMenuClick

  return (
    <>
      <div className={styles["qr-scanner"]}>
        {/* add a qr code image, paragraph 1, paragraph 2 and a button with props.handleMenuClick when ready to deliver*/}
        <img
          className={styles["qr-scanner__image"]}
          src={QRScannerImage}
          alt="qr code scanner"
        />
        <div className={styles["qr-scanner__text-container"]}>
          <p className={styles["qr-scanner__text"]}>
            Scan the QR code with a Food Bank team member to recieve the boxes
            for delivery.
          </p>
          <p className={styles["qr-scanner__text"]}>
            Once you have recieved the boxes, click the button below to begin
            your deliveries.
          </p>
        </div>
        <Link href="/deliveries">
          <button className={styles["qr-scanner__button"]}>Begin Deliveries</button>
        </Link>
      </div>
      <BackButton />
    </>
  );
}

export default QRScanner;

export default QRScanner;
