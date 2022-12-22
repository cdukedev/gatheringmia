import "./TakePart.scss";
import DeliveryImage from "../../../../assets/images/deliver.png";

function TakePart() {
  return (
    <div id="TakePart" className="take-part">
      <h1 className="take-part__title">How Can I Help?</h1>
      <img
        className="take-part__image"
        src={DeliveryImage}
        alt="people sharing food together"
      />
      <div className="take-part__text-container">
        <p className="take-part__text">
          The best way to get involved is by finding a food bank location near
          you and delivering to the homes of elderly and disabled members of our
          community that are in need of food now. We appreciate you and your
          time, which is why we built this application that provides you with
          the shortest delivery route so we may provide meals for more people.{" "}
          <br />
          <h3 className="take-part__list--header">
            You can now deliver in five easy steps.
          </h3>
          <ol className="take-part__list">
            <li>Choose Deliver Food in the app menu.</li>
            <li>
              Find the Deliveries tab on the bottom right corner of the map
              page.
            </li>
            <li>
              In the pop-up list Select the location that is most convenient for
              you, and get directions.
            </li>
            <li>
              Once you arrive to the delivery location show the provided QR code
              and proceed to picking up the boxes to deliver.
            </li>
            <li>
              You may now begin deliveries and share an incredible gift with
              those that are hungery within our community.
            </li>
          </ol>
        </p>
      </div>
    </div>
  );
}
export default TakePart;
