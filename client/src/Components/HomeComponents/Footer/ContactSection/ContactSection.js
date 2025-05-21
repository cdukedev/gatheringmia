import React from "react";
import styles from "./ContactSection.module.scss";

const ContactSection = ({ title, content, email }) => {
  return (
    <>
      <section className={styles["contact__content-items"]} data-testid="contact-section">
        <span
          className={`${styles["contact__content-item"]} ${styles["contact__content-item--bold"]}`}
          data-testid="contact-section-title"
        >
          {title}
        </span>
        <br />
        {content.map((item, index) => (
          <span
            key={index}
            className={styles["contact__content-item"]}
            data-testid="contact-section-content"
          >
            {item}
          </span>
        ))}
        {email && (
          <span className={styles["contact__content-item"]} data-testid="contact-email">
            <a className={styles["contact__content-item--link"]} href={`mailto:${email}`}>
              {email}
            </a>
          </span>
        )}
      </section>
      <hr className={styles["contact__hr"]} />
    </>
  );
};
export default ContactSection;
