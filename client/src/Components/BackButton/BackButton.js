import backButton from "../../assets/icons/map-back-button.svg";
import React from "react";
import styles from "./BackButton.module.scss";
import Link from "next/link";

export default function BackButton() {
  return (
    <div className={styles["back-button"]}>
      <Link href="/">
        <img src={backButton} alt="back button" />
      </Link>
    </div>
  );
}
