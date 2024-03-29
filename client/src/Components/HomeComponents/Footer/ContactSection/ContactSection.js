import React from "react";
import "./ContactSection.scss";

const ContactSection = ({ title, content, email }) => {
  return (
    <>
      <section className="contact__content-items" data-testid="contact-section">
        <span
          className="contact__content-item contact__content-item--bold"
          data-testid="contact-section-title"
        >
          {title}
        </span>
        <br />
        {content.map((item, index) => (
          <span
            key={index}
            className="contact__content-item"
            data-testid="contact-section-content"
          >
            {item}
          </span>
        ))}
        {email && (
          <span className="contact__content-item" data-testid="contact-email">
            <a className="contact__content-item--link" href={`mailto:${email}`}>
              {email}
            </a>
          </span>
        )}
      </section>
      <hr className="contact__hr" />
    </>
  );
};
export default ContactSection;
