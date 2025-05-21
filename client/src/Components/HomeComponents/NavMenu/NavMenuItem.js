import React from "react";
import Link from "next/link";
import styles from "./NavMenu.module.scss";

const NavMenuItem = ({ label, to, handleClick }) => {
  return (
    <Link className={styles["nav-menu__item"]} href={to} onClick={handleClick}>
      {label}
    </Link>
  );
};

export default NavMenuItem;
