import styles from "./AboutUs.module.scss";
import React from "react";
import AboutImage from "../../../assets/images/gallery/about.png";

function AboutUs() {
  return (
    <div id="AboutUs" className={styles["about-us"]} data-testid="about-us">
      <h1 className={styles["about-us__title"]}>Who We Are</h1>
      <img
        className={styles["about-us__image"]}
        src={AboutImage}
        alt="people sharing food together"
      />
      <div className={styles["about-us__text-container"]}>
        <p className={styles["about-us__text"]}>
          We are an organization that prioritizes the needs of the community
          with a focus on first providing food to those incapable of providing
          for themselves. We also building a community of like-minded people.
          Our vision is to reimagine Miami as a community built upon
          regenerative landscaping, and gardening to provide our community with
          nutrient-dense, and fresh food as well as a healthy environment.
        </p>
      </div>
    </div>
  );
}
export default AboutUs;
