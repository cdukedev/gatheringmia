import React from "react";
import styles from "./NeedHelp.module.scss";
import NeedHelpImage from "../../../assets/images/NeedHelp.png";

function NeedHelp() {
  return (
    <div id="NeedHelp" className={styles["need-help"]}>
      <h1 className={styles["need-help__title"]}>Do you need food?</h1>
      <img
        className={styles["need-help__image"]}
        src={NeedHelpImage}
        alt="people sharing food together"
      />
      <div className={styles["need-help__text-container"]}>
        <p className={styles["need-help__text"]}>
          Do you or someone you know need food? We can help you. The best way to
          find help is by calling the location closest to you. Each location
          provides us with a list of recipients that need food deliveries made
          to their homes.
        </p>
        <br />
        <h3 className={styles["need-help__list--header"]}>Easy steps to get help.</h3>
        <ol className={styles["need-help__list"]}>
          <li>Choose Find Resources in the app menu.</li>
          <li>
            Here you can filter the list of food banks and community gardens to
            just see food banks.
          </li>
          <li>
            You may call the locations closest to you to sign up to sign-up to
            recieve deliveries.
          </li>
        </ol>
        <p className={styles["good-news"]}>
          Good News! We are working with the many organizations in South Florida
          to create an easier sign-up process. This will help us to achieve a
          community where no one needs to go hungry.
        </p>
      </div>
    </div>
  );
}
export default NeedHelp;
