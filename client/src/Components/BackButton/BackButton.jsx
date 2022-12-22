import React from 'react';
import { Link } from 'react-router-dom';
import backButton from '../../assets/icons/map-back-button.svg';
import './BackButton.scss';

export default function BackButton() {
  return (
    <div className="back-button">
      <Link to="./">
        <img src={backButton} alt="back button" />
      </Link>
    </div>
  );
}
