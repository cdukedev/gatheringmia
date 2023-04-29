const fs = require("fs");

// function convertZoneAndIdToInt(recipients) {
//   return recipients.map((recipient) => {
//     return {
//       ...recipient,
//       zone: parseInt(recipient.zone, 10),
//       id: parseInt(recipient.id, 10),
//     };
//   });
// }

// const recipientsWithIntZoneAndId = convertZoneAndIdToInt(recipients);

// Write the updated recipients data back to the JSON file
// fs.writeFile(
//   "socialLinks.json",
//   JSON.stringify(socialLinks, null, 2),
//   (err) => {
//     if (err) {
//       console.error("Error writing recipients.json:", err);
//       return;
//     }
//   }
// );

function convertCoordinatesToInt(jsonData, decimalPoints = 7) {
  jsonData.forEach((entry) => {
    entry.position.lat = Number(
      parseFloat(entry.position.lat).toFixed(decimalPoints)
    );
    entry.position.lng = Number(
      parseFloat(entry.position.lng).toFixed(decimalPoints)
    );
  });
  return jsonData;
}

const data = [
  {
    position: { lat: "25.7030607", lng: "-80.2931365" },
    address: "7311 SW 62nd Ave, South Miami, FL 33143",
    type: "Community Garden",
    name: "Grow2Heal South Miami",
    phone: "No Number Listed",
    id: "0",
  },
  {
    position: { lat: "25.724859", lng: "-80.3919538" },
    address: "4590 SW 122nd Ave, Miami, FL 33175",
    type: "Community Garden",
    name: "Ready-to-Grow Gardens",
    phone: "(786) 436-7703",
    id: "1",
  },
  {
    position: { lat: "25.7280707", lng: "-80.3062472" },
    address: "6870 SW 45th Ln #7, Miami, FL 33155",
    type: "Community Garden",
    name: "Urban Oasis Project",
    phone: "(786) 427-4698",
    id: "2",
  },
  {
    position: { lat: "25.7854704", lng: "-80.1986865" },
    address: "1160 NW 2nd Ave, Miami, FL 33136",
    type: "Community Garden",
    name: "The Green Haven Project",
    phone: "No Number Listed",
    id: "3",
  },
  {
    position: { lat: "25.8459858", lng: "-80.1954869" },
    address: "7718 NE 1st Ave, Miami, FL 33138",
    type: "Community Garden",
    name: "Earth n Us",
    phone: "No Number Listed",
    id: "4",
  },
  {
    position: { lat: "25.7716224", lng: "-80.1339664" },
    address: "226 Collins Ave, Miami Beach, FL 33139",
    type: "Community Garden",
    name: "Miami Beach Community Garden",
    phone: "No Number Listed",
    id: "5",
  },
  {
    position: { lat: "25.8571169", lng: "-80.1250649" },
    address: "7398-7342, Dickens Ave, Miami Beach, FL 33141",
    type: "Community Garden",
    name: "North Beach Community Garden",
    phone: "No Number Listed",
    id: "6",
  },
  {
    position: { lat: "25.975592", lng: "80.240869" },
    address: "3700 Largo Dr, Miramar, FL 33023",
    type: "Community Garden",
    name: "Miramar Community Garden",
    phone: "(954) 602-3238",
    id: "7",
  },
  {
    position: { lat: "26.0521954", lng: "-80.151627" },
    address: "1201 W Dania Beach Blvd, Dania Beach, FL 33004",
    type: "Community Garden",
    name: "PATCH",
    phone: "(954) 924-6801",
    id: "8",
  },
  {
    position: { lat: "26.358151", lng: "-80.113797" },
    address: "1300 NW 8th St, Boca Raton, FL 33486",
    type: "Community Garden",
    name: "Boca Raton Community Garden",
    phone: "No Number Listed",
    id: "9",
  },
  {
    position: { lat: "26.1774151", lng: "-80.1340674" },
    address: "1101 NE 40th Ct, Oakland Park, FL 33334",
    type: "Community Garden",
    name: "Urban Farming Institute",
    phone: "No Number Listed",
    id: "10",
  },
  {
    position: { lat: "26.0601283", lng: "-80.2960247" },
    address: "10900 SW 48th St, Davie, FL 33328",
    type: "Community Garden",
    name: "Tree Amigos Growers",
    phone: "(954) 945-4977",
    id: "11",
  },
  {
    position: { lat: "26.2660396", lng: "-80.2935142" },
    address: "2915 Sportsplex Dr, Coral Springs, FL 33065",
    type: "Community Garden",
    name: "Rotary Community Garden of Coral Springs",
    phone: "No Number Listed",
    id: "12",
  },
  {
    position: { lat: "25.8142829", lng: "-80.2482134" },
    address: "3155 NW 43rd St, Miami, FL 33142",
    type: "Community Garden",
    name: "Brownsville Community Garden",
    phone: "(985) 707-5955",
    id: "13",
  },
  {
    position: { lat: "25.4703266", lng: "-80.5121144" },
    address: "19801 SW 320th St, Homestead, FL 33030",
    type: "Community Garden",
    name: "Paradise Farms",
    phone: "No Number Listed",
    id: "14",
  },
  {
    position: { lat: "26.2864391", lng: "-80.1022357" },
    address: "100 NE 44th St, Pompano Beach, FL 33064",
    type: "Community Garden",
    name: "The Fruitful Field",
    phone: "No Number Listed",
    id: "15",
  },
];

const convertedData = convertCoordinatesToInt(data);
console.log(JSON.stringify(convertedData));
