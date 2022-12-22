import QRScannerImage from "../../../../../assets/images/qr-scanner-image.png";
import "./QRScanner.scss";
import BackButton from "../../../../../Components/BackButton/BackButton.js";
function QRScanner(props) {
  return (
    <>
      <div className="qr-scanner">
        {/* add a qr code image, paragraph 1, paragraph 2 and a button with props.handleMenuClick when ready to deliver*/}
        <img
          className="qr-scanner__image"
          src={QRScannerImage}
          alt="qr code scanner"
        />
        <div className="qr-scanner__text-container">
          <p className="qr-scanner__text">
            Scan the QR code with a Food Bank team member to recieve the boxes
            for delivery.
          </p>
          <p className="qr-scanner__text">
            Once you have recieved the boxes, click the button below to begin
            your deliveries.
          </p>
        </div>
        <button
          className="qr-scanner__button"
          onClick={() => props.handleMenuClick("deliveries")}
        >
          Begin Deliveries
        </button>
      </div>
      <BackButton />
    </>
  );
}
export default QRScanner;
