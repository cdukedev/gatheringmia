import React from "react";
import { render, screen } from "@testing-library/react";
import { within } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Footer from "./Footer";
import socialLinksData from "../../../data/socialLinks.json";
import contactSectionsData from "../../../data/contactSection.json";

// Mock next/link
jest.mock('next/link', ({ children, href }) => {
  return React.cloneElement(children, { href });
});

describe("Footer component", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test("renders Get in Touch title", () => {
    const title = screen.getByTestId("get-in-touch-title");
    expect(title).toBeInTheDocument();
  });

  test("renders SocialLinks component with correct data", () => {
    socialLinksData.forEach(({ src }) => {
      const socialLink = screen.getByTestId(`social-link-${src}`);
      expect(socialLink).toBeInTheDocument();
    });
  });

  test("renders ContactSection components with correct data", () => {
    const sections = screen.getAllByTestId("contact-section");
    sections.forEach((section, index) => {
      expect(section).toBeInTheDocument();

      const { title, content, email } = contactSectionsData[index];

      const sectionTitle = within(section).getByText(title);
      expect(sectionTitle).toBeInTheDocument();

      content.forEach((item) => {
        const contentItem = within(section).getByText(item);
        expect(contentItem).toBeInTheDocument();
      });

      const emailLink = within(section).getByRole("link", { name: email });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute("href", `mailto:${email}`);
    });
  });

  test("renders GatheringMIA link", () => {
    const linkElement = screen.getByTestId("contact-link");
    expect(linkElement).toBeInTheDocument();
  });

  test("renders copyright notice", () => {
    const copyright = screen.getByTestId("copyright");
    expect(copyright).toBeInTheDocument();
  });
});
