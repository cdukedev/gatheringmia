import React from "react";
import Image1 from "../../../assets/images/gallery/image1.jpg";
import Image2 from "../../../assets/images/gallery/image2small.jpg";
import Image3 from "../../../assets/images/gallery/image3small.jpg";
import Image4 from "../../../assets/images/gallery/image4small.jpg";
import Image5 from "../../../assets/images/gallery/image5small.jpg";
import Image6 from "../../../assets/images/gallery/image6small.jpg";
import Image7 from "../../../assets/images/gallery/image7.jpg";
import Image8 from "../../../assets/images/gallery/image8small.jpg";

import styles from "./Gallery.module.scss";
import GalleryColumn from "./GalleryColumn";

const columnOneImages = [
  { src: Image1, alt: "text box", text: "GATHERING\nFOOD" },
  { src: Image2, alt: "Image2" },
  { src: Image3, alt: "Image3" },
  { src: Image4, alt: "Image4" },
];

const columnTwoImages = [
  { src: Image5, alt: "Image5" },
  { src: Image6, alt: "Image6" },
  { src: Image7, alt: "text box", text: "GATHERING\nTOGETHER" },
  { src: Image8, alt: "Image8" },
];

function Gallery() {
  return (
    <div className={styles.gallery}>
      <div className={styles["gallery__columns"]}>
        <GalleryColumn data-testid="gallery-column" images={columnOneImages} />
        <GalleryColumn data-testid="gallery-column" images={columnTwoImages} />
      </div>
    </div>
  );
}

export default Gallery;
