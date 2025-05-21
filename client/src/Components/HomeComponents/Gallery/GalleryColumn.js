import React from "react";
import styles from "./Gallery.module.scss";

function GalleryColumn({ images, ...props }) {
  return (
    <div className={styles["gallery__column"]} {...props}>
      {images.map((image, index) => (
        <div key={index} className={styles["gallery__item"]}>
          {image.text && (
            <span className={styles["gallery__item-text"]}>{image.text}</span>
          )}
          <img
            src={image.src}
            alt={image.alt}
            className={styles["gallery__item-image"]}
          />
        </div>
      ))}
    </div>
  );
}

export default GalleryColumn;
