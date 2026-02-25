import React from "react";
import "./HomeTop.css";
import homeTopImage from "./home_top.svg"; // Ensure this path is correct

const HomeTop = () => {
  return (
    <div className="home__top__container">
      <div className="home__top__content">
        {/* Text Section */}
        <div className="home__top__text">
          <div className="home__top__header">
            <h1>Secure, Smart, and Easy to Use — All in One</h1>
          </div>
          <div className="home__top__description">
            <p>
              Get more done with All in One. Maximize productivity with features
              like compressing, converting, editing, and more — all in one
              place.
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="home__top__image">
          <img
            src={homeTopImage}
            alt="All in One Tool"
            draggable="false"
            className="home__top__image-element"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeTop;
