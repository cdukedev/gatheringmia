import React from "react";
import Link from "next/link";

const NavMenuItem = ({ label, to, handleClick }) => {
  return (
    <Link className="nav-menu__item" href={to} onClick={handleClick}>
      {label}
    </Link>
  );
};

export default NavMenuItem;
