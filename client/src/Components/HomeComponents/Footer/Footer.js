import React from "react";
import Link from "next/link";
import SocialLinks from "./SocialLinks/SocialLinks";
import ContactSection from "./ContactSection/ContactSection";
import styles from "./Footer.module.scss";
import scrollToElement from "../../../utils/scrollToElement";
import socialLinksData from "../../../data/socialLinks.json";
import contactSectionsData from "../../../data/contactSection.json";

function Footer() {
  const handleClick = () => {
    scrollToElement("top");
  };

  return (
    <>
      <div id="contact" className={styles.contact}>
        <h2
          data-testid="get-in-touch-title"
          className={`${styles.contact__content} ${styles["contact__content-1"]} ${styles.contact__title}`}
        >
          Get in Touch
        </h2>
        <SocialLinks links={socialLinksData} />
        {contactSectionsData.map(({ title, content, email }, index) => (
          <ContactSection
            key={index}
            title={title}
            content={content}
            email={email}
          />
        ))}
        <Link
          href="/"
          onClick={() => scrollToElement("top")} // Add the onClick event handler here
          data-testid="contact-link"
          className={`${styles["contact__content-3"]} ${styles["contact__content-bottom"]} ${styles["contact__content-bottom--link"]}`}
        >
          GatheringMIA
        </Link>
        <p
          data-testid="copyright"
          className={`${styles["contact__content-7"]} ${styles["contact__content-item--copyright"]}`}
        >
          Copyright Gathering © 2023 All Rights Reserved
        </p>
      </div>
    </>
  );
}

export default Footer;
