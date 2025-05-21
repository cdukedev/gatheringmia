import React from "react";
import facebook from "../../../../assets/icons/facebook.svg";
import instagram from "../../../../assets/icons/instagram.svg";
import twitter from "../../../../assets/icons/twitter.svg";
import styles from "./SocialLinks.module.scss";

const getImageSource = (src) => {
  switch (src) {
    case "facebook":
      return facebook;
    case "instagram":
      return instagram;
    case "twitter":
      return twitter;
    default:
      return "";
  }
};

const SocialLinks = ({ links }) => {
  return (
    <div className={styles["contact__social-links"]}>
      {links.map(({ href, src, alt }) => {
        const imageSource = getImageSource(src);

        return (
          <a
            key={alt}
            className={styles["contact__social-link"]}
            href={href}
            data-testid={`social-link-${src}`}
          >
            <img
              className={styles["contact__social-link-image"]}
              src={imageSource}
              alt={alt}
            />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
