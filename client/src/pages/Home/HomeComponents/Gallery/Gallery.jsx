import "./Gallery.scss";
import Image1 from "../../../../assets/images/gallery/image1.jpg";
import Image2 from "../../../../assets/images/gallery/image2small.jpg";
import Image3 from "../../../../assets/images/gallery/image3small.jpg";
import Image4 from "../../../../assets/images/gallery/image4small.jpg";
import Image5 from "../../../../assets/images/gallery/image5small.jpg";
import Image6 from "../../../../assets/images/gallery/image6small.jpg";
import Image7 from "../../../../assets/images/gallery/image7.jpg";
import Image8 from "../../../../assets/images/gallery/image8small.jpg";
import Image9 from "../../../../assets/images/gallery/image9.jpg";

function Gallery() {
  return (
    <div className="gallery">
      <div className="gallery__columns">
        <div className="gallery__column-one">
          <div className="gallery__column-one--image-container">
            <div className="gallery__column-one--text-box">
              <span className="gallery__column-one--text">
                GATHERING <br /> FOOD
              </span>
              <img
                className="gallery__column-image"
                src={Image1}
                alt="text box"
              />
            </div>
            <img className="gallery__column-image" src={Image2} alt="Image2" />
            <img className="gallery__column-image" src={Image3} alt="Image3" />
            <img className="gallery__column-image" src={Image4} alt="Image4" />
          </div>
        </div>
        <div className="gallery__column-two">
          <div className="gallery__column-two--image-container"></div>
          <img className="gallery__column-image" src={Image5} alt="Image5" />
          <img className="gallery__column-image" src={Image6} alt="Image6" />
          <div className="gallery__column-one--text-box">
            <span className="gallery__column-one--text">
              GATHERING <br /> KNOWLEDGE
            </span>
            <img
              className="gallery__column-image"
              src={Image7}
              alt="text box"
            />
          </div>
          <img className="gallery__column-image" src={Image8} alt="Image8" />
        </div>
      </div>
      <div className="gallery__column-one--text-box">
        <span className="gallery__column-one--text">
          GATHERING <br /> TOGETHER
        </span>
        <img
          className="gallery__column-one--image-9"
          src={Image9}
          alt="text box"
        />
      </div>
    </div>
  );
}
export default Gallery;
