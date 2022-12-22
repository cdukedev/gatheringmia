import React from 'react';
import './MapFilter.scss';
import MapMenuArrow from '../../../../assets/icons/map-menu-arrow.svg';
import FilterOn from '../../../../assets/icons/filter-on.svg';
import FilterOff from '../../../../assets/icons/filter-off.svg';

function MapFilter(props) {
  return (
    <div className="map-filter__container">
      <div className="map-filter__text">
        <div className="map-filter__top-row">
          <img
            className="map-filter__top-row--arrow"
            onClick={() => {
              props.handleMenuClick('defaultMenu');
            }}
            src={MapMenuArrow}
            alt="menu arrow to close helper"
          />
        </div>
        <div className="map-filter__bottom-container">
          <div
            className={
              props.foodBankToggle
                ? 'map-filter__bottom-container--items'
                : 'map-filter__bottom-container--items map-filter__bottom-container--items-off'
            }
            onClick={() => {
              props.handleFoodBankToggle();
            }}
          >
            <span className="map-filter__bottom-container--item-text">
              Food Pantries
            </span>
            <img
              className="map-filter__bottom-container--item"
              src={props.foodBankToggle ? FilterOn : FilterOff}
              alt="FoodBank Icon"
            />
          </div>
          <div
            className={
              props.communityGardenToggle
                ? 'map-filter__bottom-container--items'
                : 'map-filter__bottom-container--items map-filter__bottom-container--items-off'
            }
            onClick={() => {
              props.handleCommunityGardenToggle();
            }}
          >
            <span className="map-filter__bottom-container--item-text">
              Gardens
            </span>
            <img
              className="map-filter__bottom-container--item"
              src={props.communityGardenToggle ? FilterOn : FilterOff}
              alt="CommunityGarden Icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default MapFilter;
