//@flow

import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./MapPage.scss";
import MapMenu from "./MapPageComponents/MapMenu/MapMenu";
import Map from "./MapPageComponents/Map/Map";
import MapHelp from "./MapPageComponents/MapHelp/MapHelp";
import MapFilter from "./MapPageComponents/MapFilter/MapFilter";
import MapDeliveries from "./MapPageComponents/MapDeliveries/MapDeliveries";
import Deliveries from "./MapPageComponents/MapDeliveryComponents/Deliveries/Deliveries";
import BackButton from "../../Components/BackButton/BackButton";
import QRScanner from "./MapPageComponents/MapDeliveryComponents/QRScanner/QRScanner";
import Splash from "../../Components/Splash/Splash";

class MapPage extends React.Component {
  state = {
    menu: "defaultMenu",
    coords: null,
    zone: null,
    foodBankToggle: true,
    communityGardenToggle: true,
    foodBanks: [
      {
        id: 1,
        name: "Food For Life Network",
        position: {
          lat: 25.8017556,
          lng: -80.2035881,
        },
        address: "3510 Biscayne Blvd, Miami, FL 33137",
        type: "Food Bank",
        zone: 1,
        phone: "(305) 576-3663",
      },
      {
        id: 2,
        name: "Saint John Baptist Church",
        position: {
          lat: 25.78734,
          lng: -80.20012,
        },
        address: "1328 NW 3rd Ave, Miami, FL 33136",
        type: "Food Bank",
        zone: 2,
        phone: "(305) 372-3877",
      },
      {
        id: 3,
        name: "Feeding South Florida",
        position: {
          lat: 25.98715,
          lng: -80.17347,
        },
        address: "2501 SW 32nd Terrace, Pembroke Park, FL 33023",
        type: "Food Bank",
        zone: 3,
        phone: "(954) 518-1818",
      },
      {
        id: 4,
        name: "Farm Share",
        position: {
          lat: 26.233641,
          lng: -80.139748,
        },
        address: "1255 W Atlantic Blvd, Pompano Beach, FL 33069",
        type: "Food Bank",
        zone: 1,
        phone: "(954) 942-6785",
      },
      {
        id: 5,
        name: "Glory Temple Ministries",
        position: {
          lat: 25.847023,
          lng: -80.233667,
        },
        address: "7950 NW 22 Avenue, Miami, FL 33147",
        type: "Food Bank",
        zone: 2,
        phone: "(305) 456-5216",
      },
      {
        id: 6,
        name: "Curleys House of Style",
        position: {
          lat: 25.830699,
          lng: -80.20648,
        },
        address: "6025 N.W. 6 Court, Miami, FL 33127",
        type: "Food Bank",
        zone: 3,
        phone: "(305) 759-9805",
      },
      {
        id: 7,
        name: "Mt Pisgah Seventh-day Adventist Church",
        position: {
          lat: 25.9712261,
          lng: -80.2568991,
        },
        address: "3340 NW 215th St, Miami Gardens, FL 33056",
        type: "Food Bank",
        zone: 1,
        phone: "(305) 624-0679",
      },
      {
        id: 8,
        name: "Glory Temple Ministries",
        position: {
          lat: 26.233641,
          lng: -80.139748,
        },
        address: "7950 NW 22 Avenue Miami, FL 33147",
        type: "Food Bank",
        zone: 2,
        phone: "(305) 456-5216",
      },
      {
        id: 9,
        name: "Harvest Fire Worship Center",
        position: {
          lat: 25.9408686,
          lng: -80.2390172,
        },
        address: "18291 NW 23rd Ave #3757, Miami Gardens, FL 33056",
        type: "Food Bank",
        zone: 3,
        phone: "(305) 620-2986",
      },
      {
        id: 10,
        name: "Volunteers of America of FL",
        position: {
          lat: 25.7731991,
          lng: -80.2194653,
        },
        address: "1492 W Flagler Street Miami, FL 33135",
        type: "Food Bank",
        zone: 1,
        phone: "(305) 644-0335",
      },
      {
        id: 11,
        name: "Miami Peniel Church Nazarene",
        position: {
          lat: 25.8288133,
          lng: -80.1917071,
        },
        address: "5801 NE 2nd Ave Miami, FL 33137",
        type: "Food Bank",
        zone: 2,
        phone: "(305) 770-1960",
      },
    ],
    communityGardens: [
      {
        position: {
          lat: 25.7030607,
          lng: -80.2931365,
        },
        address: "7311 SW 62nd Ave, South Miami, FL 33143",
        type: "Community Garden",
        name: "Grow2Heal South Miami",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.724859,
          lng: -80.3919538,
        },
        address: "4590 SW 122nd Ave, Miami, FL 33175",
        type: "Community Garden",
        name: "Ready-to-Grow Gardens",
        phone: "(786) 436-7703",
      },
      {
        position: {
          lat: 25.7280707,
          lng: -80.3062472,
        },
        address: "6870 SW 45th Ln #7, Miami, FL 33155",
        type: "Community Garden",
        name: "Urban Oasis Project",
        phone: "(786) 427-4698",
      },
      {
        position: {
          lat: 25.7854704,
          lng: -80.1986865,
        },
        address: "1160 NW 2nd Ave, Miami, FL 33136",
        type: "Community Garden",
        name: "The Green Haven Project",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.8459858,
          lng: -80.1954869,
        },
        address: "7718 NE 1st Ave, Miami, FL 33138",
        type: "Community Garden",
        name: "Earth n Us",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.7716224,
          lng: -80.1339664,
        },
        address: "226 Collins Ave, Miami Beach, FL 33139",
        type: "Community Garden",
        name: "Miami Beach Community Garden",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.8571169,
          lng: -80.1250649,
        },
        address: "7398-7342, Dickens Ave, Miami Beach, FL 33141",
        type: "Community Garden",
        name: "North Beach Community Garden",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.975592,
          lng: 80.240869,
        },
        address: "3700 Largo Dr, Miramar, FL 33023",
        type: "Community Garden",
        name: "Miramar Community Garden",
        phone: "(954) 602-3238",
      },
      {
        position: {
          lat: 26.0521954,
          lng: -80.151627,
        },
        address: "1201 W Dania Beach Blvd, Dania Beach, FL 33004",
        type: "Community Garden",
        name: "PATCH",
        phone: "(954) 924-6801",
      },
      {
        position: {
          lat: 26.358151,
          lng: -80.113797,
        },
        address: "1300 NW 8th St, Boca Raton, FL 33486",
        type: "Community Garden",
        name: "Boca Raton Community Garden",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 26.1774151,
          lng: -80.1340674,
        },
        address: "1101 NE 40th Ct, Oakland Park, FL 33334",
        type: "Community Garden",
        name: "Urban Farming Institute",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 26.0601283,
          lng: -80.2960247,
        },
        address: "10900 SW 48th St, Davie, FL 33328",
        type: "Community Garden",
        name: "Tree Amigos Growers",
        phone: "(954) 945-4977",
      },
      {
        position: {
          lat: 26.2660396,
          lng: -80.2935142,
        },
        address: "2915 Sportsplex Dr, Coral Springs, FL 33065",
        type: "Community Garden",
        name: "Rotary Community Garden of Coral Springs",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.8142829,
          lng: -80.2482134,
        },
        address: "3155 NW 43rd St, Miami, FL 33142",
        type: "Community Garden",
        name: "Brownsville Community Garden",
        phone: "(985) 707-5955",
      },
      {
        position: {
          lat: 25.4703266,
          lng: -80.5121144,
        },
        address: "19801 SW 320th St, Homestead, FL 33030",
        type: "Community Garden",
        name: "Paradise Farms",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 26.2864391,
          lng: -80.1022357,
        },
        address: "100 NE 44th St, Pompano Beach, FL 33064",
        type: "Community Garden",
        name: "The Fruitful Field",
        phone: "No Number Listed",
      },
    ],
    initialMarkers: [
      {
        position: {
          lat: 25.8017556,
          lng: -80.2035881,
        },
        address: "3510 Biscayne Blvd, Miami, FL 33137",
        type: "Food Bank",
        zone: "1",
        name: "Food For Life Network",
        phone: "(305) 576-3663",
      },
      {
        position: {
          lat: 25.78734,
          lng: -80.20012,
        },
        address: "1328 NW 3rd Ave, Miami, FL 33136",
        type: "Food Bank",
        zone: "2",
        name: "Saint John Baptist Church",
        phone: "(305) 372-3877",
      },
      {
        position: {
          lat: 25.98715,
          lng: -80.17347,
        },
        address: "2501 SW 32nd Terrace, Pembroke Park, FL 33023",
        type: "Food Bank",
        zone: "3",
        name: "Feeding South Florida",
        phone: "(954) 518-1818",
      },
      {
        position: {
          lat: 26.233641,
          lng: -80.139748,
        },
        address: "1255 W Atlantic Blvd, Pompano Beach, FL 33069",
        type: "Food Bank",
        zone: "4",
        name: "Farm Share",
        phone: "(954) 942-6785",
      },
      {
        position: {
          lat: 25.847023,
          lng: -80.233667,
        },
        address: "7950 NW 22 Avenue, Miami, FL 33147",
        type: "Food Bank",
        zone: "5",
        name: "Glory Temple Ministries",
        phone: "(305) 456-5216",
      },
      {
        position: {
          lat: 25.830699,
          lng: -80.20648,
        },
        address: "6025 N.W. 6 Court, Miami, FL 33127",
        type: "Food Bank",
        zone: "6",
        name: "Curleys House of Style",
        phone: "(305) 759-9805",
      },
      {
        position: {
          lat: 25.9712261,
          lng: -80.2568991,
        },
        address: "3340 NW 215th St, Miami Gardens, FL 33056",
        type: "Food Bank",
        zone: "7",
        name: "Mt Pisgah Seventh-day Adventist Church",
        phone: "(305) 624-0679",
      },
      {
        position: {
          lat: 26.233641,
          lng: -80.139748,
        },
        address: "7950 NW 22 Avenue Miami, FL 33147",
        type: "Food Bank",
        zone: "8",
        name: "Glory Temple Ministries",
        phone: "(305) 456-5216",
      },
      {
        position: {
          lat: 25.9408686,
          lng: -80.2390172,
        },
        address: "18291 NW 23rd Ave #3757, Miami Gardens, FL 33056",
        type: "Food Bank",
        zone: "9",
        name: "Harvest Fire Worship Center",
        phone: "(305) 620-2986",
      },
      {
        position: {
          lat: 25.7731991,
          lng: -80.2194653,
        },
        address: "1492 W Flagler Street Miami, FL 33135",
        type: "Food Bank",
        zone: "10",
        name: "Volunteers of America of FL",
        phone: "(305) 644-0335",
      },
      {
        position: {
          lat: 25.8288133,
          lng: -80.1917071,
        },
        address: "5801 NE 2nd Ave Miami, FL 33137",
        type: "Food Bank",
        zone: "11",
        name: "Miami Peniel Church Nazarene",
        phone: "(305) 770-1960",
      },
      {
        position: {
          lat: 25.7030607,
          lng: -80.2931365,
        },
        address: "7311 SW 62nd Ave, South Miami, FL 33143",
        type: "Community Garden",
        name: "Grow2Heal South Miami",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.724859,
          lng: -80.3919538,
        },
        address: "4590 SW 122nd Ave, Miami, FL 33175",
        type: "Community Garden",
        name: "Ready-to-Grow Gardens",
        phone: "(786) 436-7703",
      },
      {
        position: {
          lat: 25.7280707,
          lng: -80.3062472,
        },
        address: "6870 SW 45th Ln #7, Miami, FL 33155",
        type: "Community Garden",
        name: "Urban Oasis Project",
        phone: "(786) 427-4698",
      },
      {
        position: {
          lat: 25.7854704,
          lng: -80.1986865,
        },
        address: "1160 NW 2nd Ave, Miami, FL 33136",
        type: "Community Garden",
        name: "The Green Haven Project",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.8459858,
          lng: -80.1954869,
        },
        address: "7718 NE 1st Ave, Miami, FL 33138",
        type: "Community Garden",
        name: "Earth n Us",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.7716224,
          lng: -80.1339664,
        },
        address: "226 Collins Ave, Miami Beach, FL 33139",
        type: "Community Garden",
        name: "Miami Beach Community Garden",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.8571169,
          lng: -80.1250649,
        },
        address: "7398-7342, Dickens Ave, Miami Beach, FL 33141",
        type: "Community Garden",
        name: "North Beach Community Garden",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.975592,
          lng: 80.240869,
        },
        address: "3700 Largo Dr, Miramar, FL 33023",
        type: "Community Garden",
        name: "Miramar Community Garden",
        phone: "(954) 602-3238",
      },
      {
        position: {
          lat: 26.0521954,
          lng: -80.151627,
        },
        address: "1201 W Dania Beach Blvd, Dania Beach, FL 33004",
        type: "Community Garden",
        name: "PATCH",
        phone: "(954) 924-6801",
      },
      {
        position: {
          lat: 26.358151,
          lng: -80.113797,
        },
        address: "1300 NW 8th St, Boca Raton, FL 33486",
        type: "Community Garden",
        name: "Boca Raton Community Garden",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 26.1774151,
          lng: -80.1340674,
        },
        address: "1101 NE 40th Ct, Oakland Park, FL 33334",
        type: "Community Garden",
        name: "Urban Farming Institute",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 26.0601283,
          lng: -80.2960247,
        },
        address: "10900 SW 48th St, Davie, FL 33328",
        type: "Community Garden",
        name: "Tree Amigos Growers",
        phone: "(954) 945-4977",
      },
      {
        position: {
          lat: 26.2660396,
          lng: -80.2935142,
        },
        address: "2915 Sportsplex Dr, Coral Springs, FL 33065",
        type: "Community Garden",
        name: "Rotary Community Garden of Coral Springs",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 25.8142829,
          lng: -80.2482134,
        },
        address: "3155 NW 43rd St, Miami, FL 33142",
        type: "Community Garden",
        name: "Brownsville Community Garden",
        phone: "(985) 707-5955",
      },
      {
        position: {
          lat: 25.4703266,
          lng: -80.5121144,
        },
        address: "19801 SW 320th St, Homestead, FL 33030",
        type: "Community Garden",
        name: "Paradise Farms",
        phone: "No Number Listed",
      },
      {
        position: {
          lat: 26.2864391,
          lng: -80.1022357,
        },
        address: "100 NE 44th St, Pompano Beach, FL 33064",
        type: "Community Garden",
        name: "The Fruitful Field",
        phone: "No Number Listed",
      },
    ],
    recipients: [
      {
        position: {
          lat: "25.1772916",
          lng: "-80.0127137",
        },
        name: "Tatiania Flecknoe",
        phone: "(469) 547-8091",
        type: "home",
        address: "1 Arkansas Hill",
        zone: 3,
      },
      {
        position: {
          lat: "25.1221619",
          lng: "-80.5612823",
        },
        name: "Daron Foreman",
        phone: "(571) 314-8131",
        type: "home",
        address: "48 American Ash Alley",
        zone: 3,
      },
      {
        position: { lat: "25.6676566", lng: "-80.1922425" },
        name: "Marty Gierck",
        phone: "(502) 353-3827",
        type: "home",
        address: "309 Tennyson Point",
        zone: 3,
      },
      {
        position: { lat: "25.6165567", lng: "-80.1621800" },
        name: "Allie Gothrup",
        phone: "(159) 157-7423",
        type: "home",
        address: "1999 Debs Road",
        zone: 2,
      },
      {
        position: { lat: "25.1222154", lng: "-80.0668902" },
        name: "Chelsae Wildes",
        phone: "(649) 325-7136",
        type: "home",
        address: "6588 Superior Plaza",
        zone: 3,
      },
      {
        position: { lat: "25.8536727", lng: "-80.7459171" },
        name: "Lisa Larsen",
        phone: "(479) 520-3781",
        type: "home",
        address: "2573 Vahlen Trail",
        zone: 2,
      },
      {
        position: { lat: "25.2801423", lng: "-80.6620736" },
        name: "Sela Endersby",
        phone: "(303) 171-8088",
        type: "home",
        address: "64554 Nobel Point",
        zone: 2,
      },
      {
        position: { lat: "25.7274299", lng: "-80.2933482" },
        name: "Travers Berzon",
        phone: "(934) 204-1341",
        type: "home",
        address: "5 Debs Circle",
        zone: 1,
      },
      {
        position: { lat: "25.3548636", lng: "-80.1226218" },
        name: "Crystie Exter",
        phone: "(146) 985-1570",
        type: "home",
        address: "1999 Porter Trail",
        zone: 1,
      },
      {
        position: { lat: "25.3449567", lng: "-80.4320632" },
        name: "Cecil Mohamed",
        phone: "(574) 923-6856",
        type: "home",
        address: "129 Mitchell Place",
        zone: 3,
      },
      {
        position: { lat: "25.4285435", lng: "-80.0422055" },
        name: "Mathe Kidder",
        phone: "(706) 938-2812",
        type: "home",
        address: "7 Porter Place",
        zone: 3,
      },
      {
        position: { lat: "25.9456920", lng: "-80.1659736" },
        name: "Idaline Parr",
        phone: "(368) 114-5393",
        type: "home",
        address: "5 Oak Valley Street",
        zone: 1,
      },
      {
        position: { lat: "25.8309635", lng: "-80.1776568" },
        name: "Evangeline Kineton",
        phone: "(531) 401-1194",
        type: "home",
        address: "31 Ludington Hill",
        zone: 2,
      },
      {
        position: { lat: "25.7168439", lng: "-80.1817318" },
        name: "Leonardo State",
        phone: "(330) 400-2199",
        type: "home",
        address: "60 Myrtle Park",
        zone: 3,
      },
      {
        position: { lat: "25.1164896", lng: "-80.8719580" },
        name: "Lizzie Eland",
        phone: "(337) 788-8421",
        type: "home",
        address: "336 Kensington Alley",
        zone: 3,
      },
      {
        position: { lat: "25.7185390", lng: "-80.9736355" },
        name: "Arielle Churching",
        phone: "(171) 160-3162",
        type: "home",
        address: "4 Corben Court",
        zone: 3,
      },
      {
        position: { lat: "25.0554084", lng: "-80.2735746" },
        name: "Carole Gooble",
        phone: "(913) 682-2112",
        type: "home",
        address: "4 Nelson Circle",
        zone: 2,
      },
      {
        position: { lat: "25.2394543", lng: "-80.5876837" },
        name: "Querida Purcer",
        phone: "(530) 211-9126",
        type: "home",
        address: "127 Merry Hill",
        zone: 1,
      },
      {
        position: { lat: "25.7641233", lng: "-80.2642645" },
        name: "Arabele Hasnney",
        phone: "(995) 742-5666",
        type: "home",
        address: "6 Hollow Ridge Avenue",
        zone: 2,
      },
      {
        position: { lat: "25.3233187", lng: "-80.0405822" },
        name: "Winfield Egleton",
        phone: "(479) 674-8560",
        type: "home",
        address: "982 Spohn Center",
        zone: 1,
      },
      {
        position: { lat: "25.5990964", lng: "-80.4676601" },
        name: "Burke Clemitt",
        phone: "(328) 708-1197",
        type: "home",
        address: "244 Waywood Hill",
        zone: 1,
      },
      {
        position: { lat: "25.9308154", lng: "-80.6280679" },
        name: "Diane-marie Verny",
        phone: "(100) 685-9262",
        type: "home",
        address: "547 Meadow Ridge Parkway",
        zone: 1,
      },
      {
        position: { lat: "25.0323716", lng: "-80.7588708" },
        name: "Diena Mainson",
        phone: "(995) 869-1407",
        type: "home",
        address: "7 Transport Plaza",
        zone: 1,
      },
      {
        position: { lat: "25.2253925", lng: "-80.6070048" },
        name: "Georgena Haggus",
        phone: "(515) 613-4127",
        type: "home",
        address: "95 Anzinger Parkway",
        zone: 2,
      },
      {
        position: { lat: "25.2373087", lng: "-80.9303017" },
        name: "Simon Andrini",
        phone: "(504) 279-3398",
        type: "home",
        address: "2384 Weeping Birch Avenue",
        zone: 3,
      },
      {
        position: { lat: "25.4045388", lng: "-80.1159465" },
        name: "Annabal Kettridge",
        phone: "(977) 448-1661",
        type: "home",
        address: "33 Maple Place",
        zone: 2,
      },
      {
        position: { lat: "25.8889806", lng: "-80.0418679" },
        name: "Blondie Skinley",
        phone: "(479) 762-8689",
        type: "home",
        address: "5725 Prairie Rose Avenue",
        zone: 2,
      },
      {
        position: { lat: "25.0447472", lng: "-80.8877066" },
        name: "Lucine Edmonston",
        phone: "(749) 548-1821",
        type: "home",
        address: "11 Kinsman Hill",
        zone: 3,
      },
      {
        position: { lat: "25.5053537", lng: "-80.6070221" },
        name: "Paulina Guyer",
        phone: "(851) 662-8605",
        type: "home",
        address: "17 Merrick Point",
        zone: 3,
      },
      {
        position: { lat: "25.9184236", lng: "-80.8311156" },
        name: "Nealy Druhan",
        phone: "(902) 723-6280",
        type: "home",
        address: "0 Maple Center",
        zone: 3,
      },
      {
        position: { lat: "25.6737037", lng: "-80.7086632" },
        name: "Ninette Bradane",
        phone: "(840) 433-0941",
        type: "home",
        address: "5 Summerview Avenue",
        zone: 1,
      },
      {
        position: { lat: "25.7502488", lng: "-80.0758438" },
        name: "Tracie Legister",
        phone: "(734) 211-6305",
        type: "home",
        address: "5242 Sycamore Place",
        zone: 2,
      },
      {
        position: { lat: "25.1905195", lng: "-80.3157804" },
        name: "Patin Rappaport",
        phone: "(540) 641-2090",
        type: "home",
        address: "2609 1st Plaza",
        zone: 1,
      },
      {
        position: { lat: "25.9705445", lng: "-80.2927745" },
        name: "Vita Heyward",
        phone: "(624) 970-3326",
        type: "home",
        address: "200 Schurz Lane",
        zone: 2,
      },
      {
        position: { lat: "25.0786768", lng: "-80.4406934" },
        name: "Mirelle Putson",
        phone: "(993) 246-5667",
        type: "home",
        address: "6 Golf Lane",
        zone: 1,
      },
      {
        position: { lat: "25.0586062", lng: "-80.3204615" },
        name: "Nathalia Hanbidge",
        phone: "(589) 197-4375",
        type: "home",
        address: "0 Sundown Plaza",
        zone: 2,
      },
      {
        position: { lat: "25.5209476", lng: "-80.0971246" },
        name: "Barri Matula",
        phone: "(336) 378-1800",
        type: "home",
        address: "91 Rigney Park",
        zone: 1,
      },
      {
        position: { lat: "25.8366693", lng: "-80.1240482" },
        name: "Myra Ramalhete",
        phone: "(536) 997-7786",
        type: "home",
        address: "415 Sullivan Trail",
        zone: 2,
      },
      {
        position: { lat: "25.7339806", lng: "-80.0614701" },
        name: "Mikaela Biers",
        phone: "(322) 970-0923",
        type: "home",
        address: "76703 Roth Court",
        zone: 2,
      },
      {
        position: { lat: "25.4409802", lng: "-80.0086374" },
        name: "Conn Goldine",
        phone: "(290) 389-0731",
        type: "home",
        address: "0 Summerview Road",
        zone: 3,
      },
      {
        position: { lat: "25.5608706", lng: "-80.1757859" },
        name: "Jedediah Pennick",
        phone: "(164) 559-5530",
        type: "home",
        address: "3944 Meadow Ridge Crossing",
        zone: 1,
      },
      {
        position: { lat: "25.1755478", lng: "-80.5270740" },
        name: "Rivkah Nannetti",
        phone: "(806) 548-5782",
        type: "home",
        address: "760 Vidon Terrace",
        zone: 3,
      },
      {
        position: { lat: "25.0746361", lng: "-80.3019339" },
        name: "Konrad Pancoast",
        phone: "(188) 428-7291",
        type: "home",
        address: "11 Luster Circle",
        zone: 3,
      },
      {
        position: { lat: "25.1562256", lng: "-80.8025275" },
        name: "Merell Suerz",
        phone: "(514) 240-2530",
        type: "home",
        address: "225 Little Fleur Center",
        zone: 1,
      },
      {
        position: { lat: "25.2010028", lng: "-80.6923546" },
        name: "Rosamond Glasby",
        phone: "(863) 842-6577",
        type: "home",
        address: "4047 Stone Corner Center",
        zone: 1,
      },
      {
        position: { lat: "25.1928706", lng: "-80.5145234" },
        name: "Bathsheba Manneville",
        phone: "(277) 805-2685",
        type: "home",
        address: "0327 Michigan Park",
        zone: 3,
      },
      {
        position: { lat: "25.0900946", lng: "-80.9391710" },
        name: "Barri Maudlen",
        phone: "(166) 433-8992",
        type: "home",
        address: "480 Commercial Alley",
        zone: 3,
      },
      {
        position: { lat: "25.8103348", lng: "-80.2813423" },
        name: "Axe John",
        phone: "(628) 563-8874",
        type: "home",
        address: "62875 Stone Corner Hill",
        zone: 1,
      },
      {
        position: { lat: "25.8418905", lng: "-80.0405021" },
        name: "Cesar Hartzog",
        phone: "(634) 514-1181",
        type: "home",
        address: "2 Hagan Drive",
        zone: 3,
      },
      {
        position: { lat: "25.2273714", lng: "-80.1485529" },
        name: "Gustave Meeson",
        phone: "(430) 634-7588",
        type: "home",
        address: "86691 North Hill",
        zone: 1,
      },
      {
        position: { lat: "25.8434518", lng: "-80.6864654" },
        name: "Celina Silverwood",
        phone: "(699) 534-6044",
        type: "home",
        address: "5 Waubesa Junction",
        zone: 1,
      },
      {
        position: { lat: "25.1671602", lng: "-80.1174071" },
        name: "Gearard Bowlesworth",
        phone: "(103) 475-9234",
        type: "home",
        address: "55 Oxford Lane",
        zone: 2,
      },
      {
        position: { lat: "25.4049840", lng: "-80.6251342" },
        name: "Zacherie McGreay",
        phone: "(833) 702-7429",
        type: "home",
        address: "1 Utah Place",
        zone: 2,
      },
      {
        position: { lat: "25.2239607", lng: "-80.9809757" },
        name: "Guy Cockton",
        phone: "(203) 845-9442",
        type: "home",
        address: "96 Lillian Street",
        zone: 3,
      },
      {
        position: { lat: "25.1204435", lng: "-80.7404450" },
        name: "April Blore",
        phone: "(212) 637-8480",
        type: "home",
        address: "264 Hagan Point",
        zone: 1,
      },
      {
        position: { lat: "25.6860785", lng: "-80.1493182" },
        name: "Leila Le Teve",
        phone: "(646) 256-8987",
        type: "home",
        address: "86 Fulton Center",
        zone: 3,
      },
      {
        position: { lat: "25.1172407", lng: "-80.1792679" },
        name: "Lexie Loosley",
        phone: "(520) 447-0757",
        type: "home",
        address: "8413 Village Green Plaza",
        zone: 1,
      },
      {
        position: { lat: "25.2796116", lng: "-80.5599939" },
        name: "Dunc McCall",
        phone: "(499) 765-5506",
        type: "home",
        address: "1 Steensland Junction",
        zone: 3,
      },
      {
        position: { lat: "25.7452146", lng: "-80.4785511" },
        name: "Bronson Stoffersen",
        phone: "(601) 200-2943",
        type: "home",
        address: "48 Grim Hill",
        zone: 3,
      },
      {
        position: { lat: "25.3513834", lng: "-80.1146339" },
        name: "Fernando Fante",
        phone: "(703) 678-1952",
        type: "home",
        address: "51 Northwestern Hill",
        zone: 2,
      },
      {
        position: { lat: "25.3902554", lng: "-80.1448075" },
        name: "Flynn MacVicar",
        phone: "(414) 455-7636",
        type: "home",
        address: "041 Knutson Parkway",
        zone: 3,
      },
      {
        position: { lat: "25.1587812", lng: "-80.5899600" },
        name: "Maryjo O'Tierney",
        phone: "(112) 216-6730",
        type: "home",
        address: "84116 Barby Lane",
        zone: 1,
      },
      {
        position: { lat: "25.7411098", lng: "-80.0515285" },
        name: "Mariann Backs",
        phone: "(467) 124-3790",
        type: "home",
        address: "91 Lawn Center",
        zone: 3,
      },
      {
        position: { lat: "25.7429422", lng: "-80.1079259" },
        name: "Elvina Shea",
        phone: "(372) 820-1697",
        type: "home",
        address: "52 Meadow Vale Street",
        zone: 1,
      },
      {
        position: { lat: "25.6230961", lng: "-80.3843100" },
        name: "Hercule Daughtery",
        phone: "(404) 314-2008",
        type: "home",
        address: "370 Lakewood Gardens Lane",
        zone: 1,
      },
      {
        position: { lat: "25.5440723", lng: "-80.4327743" },
        name: "Sascha Yanshinov",
        phone: "(864) 464-0343",
        type: "home",
        address: "99339 Reinke Parkway",
        zone: 3,
      },
      {
        position: { lat: "25.4841723", lng: "-80.4417669" },
        name: "Kary Gravenell",
        phone: "(212) 922-6805",
        type: "home",
        address: "4 Warner Court",
        zone: 3,
      },
      {
        position: { lat: "25.4268449", lng: "-80.4584032" },
        name: "Matthus Sporle",
        phone: "(226) 254-0078",
        type: "home",
        address: "48654 Northfield Avenue",
        zone: 1,
      },
      {
        position: { lat: "25.5093411", lng: "-80.9441973" },
        name: "Filmer Burditt",
        phone: "(971) 741-6384",
        type: "home",
        address: "50148 Rigney Pass",
        zone: 2,
      },
      {
        position: { lat: "25.4513692", lng: "-80.5728696" },
        name: "Hermine Pitbladdo",
        phone: "(740) 399-8654",
        type: "home",
        address: "0 Quincy Hill",
        zone: 1,
      },
      {
        position: { lat: "25.5379965", lng: "-80.1363245" },
        name: "Ruperto Seivwright",
        phone: "(155) 267-1702",
        type: "home",
        address: "7461 Sycamore Lane",
        zone: 3,
      },
      {
        position: { lat: "25.9402187", lng: "-80.2848772" },
        name: "Petey Loache",
        phone: "(899) 980-7926",
        type: "home",
        address: "6 Coleman Crossing",
        zone: 1,
      },
      {
        position: { lat: "25.9555050", lng: "-80.8451887" },
        name: "Joni Grocutt",
        phone: "(608) 455-8703",
        type: "home",
        address: "7 Kenwood Place",
        zone: 3,
      },
      {
        position: { lat: "25.3240740", lng: "-80.2229145" },
        name: "Shurlock Kobelt",
        phone: "(140) 877-7465",
        type: "home",
        address: "65798 Mariners Cove Center",
        zone: 3,
      },
      {
        position: { lat: "25.3604516", lng: "-80.5504445" },
        name: "Tanny Crighton",
        phone: "(212) 694-8625",
        type: "home",
        address: "26599 Homewood Alley",
        zone: 1,
      },
      {
        position: { lat: "25.0010718", lng: "-80.4758783" },
        name: "Norine Sandars",
        phone: "(940) 561-5788",
        type: "home",
        address: "0767 Bashford Hill",
        zone: 2,
      },
      {
        position: { lat: "25.0188197", lng: "-80.3074161" },
        name: "Regina Grier",
        phone: "(564) 561-5201",
        type: "home",
        address: "2198 Spenser Plaza",
        zone: 1,
      },
      {
        position: { lat: "25.3994267", lng: "-80.0136742" },
        name: "Lillis Duchasteau",
        phone: "(669) 202-5387",
        type: "home",
        address: "5365 Holmberg Alley",
        zone: 2,
      },
    ],
  };
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        if (position.coords.latitude && position.coords.longitude) {
          console.log(
            "componantDidMount",
            position.coords.latitude,
            position.coords.longitude
          );
          this.setState({
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        } else {
          console.log("componantDidMount", "no coords");
          this.setState({
            coords: {
              lat: 25.7411098,
              lng: -80.0515285,
            },
          });
        }
      }.bind(this)
    );
  }
  handleMenuClick = (clickedMenu) => {
    this.setState({
      menu: clickedMenu,
    });
  };
  handleDeliveryClick = (clicked, zone) => {
    this.setState({
      menu: clicked,
      zone: zone,
    });
  };

  handleFoodBankToggle = () => {
    this.setState({
      foodBankToggle: !this.state.foodBankToggle,
    });
  };

  handleCommunityGardenToggle = () => {
    this.setState({
      communityGardenToggle: !this.state.communityGardenToggle,
    });
  };

  render() {
    if (!this.state.coords) {
      return <Splash />;
    } else {
      if (this.state.menu === "mapDeliveries") {
        return (
          <div className="map-deliveries">
            <Map
              coords={this.state.coords}
              foodBankToggle={this.state.foodBankToggle}
              communityGardenToggle={this.state.communityGardenToggle}
              deliveriesToggle={this.state.deliveriesToggle}
              foodBanks={this.state.foodBanks}
              height="calc(100vh - 280px)"
            />
            <MapDeliveries
              handleDeliveryClick={this.handleDeliveryClick}
              handleMenuClick={this.handleMenuClick}
              foodBanks={this.state.foodBanks}
              coords={this.state.coords}
            />
            <BackButton />
          </div>
        );
      } else if (this.state.menu === "deliveries") {
        return (
          <div className="deliveries">
            <Deliveries
              handleMenuClick={this.handleMenuClick}
              recipients={this.state.recipients}
              coords={this.state.coords}
              zone={this.state.zone}
            />
          </div>
        );
      } else if (this.state.menu === "mapHelp") {
        return (
          <div className="map-help">
            <Map
              coords={this.state.coords}
              foodBankToggle={this.state.foodBankToggle}
              communityGardenToggle={this.state.communityGardenToggle}
              deliveriesToggle={this.state.deliveriesToggle}
              foodBanks={this.state.foodBanks}
              communityGardens={this.state.communityGardens}
              deliveryLocations={this.state.deliveryLocations}
              height="calc(100vh - 135px)"
            />
            <MapHelp handleMenuClick={this.handleMenuClick} />
            <BackButton />
          </div>
        );
      } else if (this.state.menu === "mapFilter") {
        return (
          <div className="map-filter">
            <Map
              coords={this.state.coords}
              foodBankToggle={this.state.foodBankToggle}
              communityGardenToggle={this.state.communityGardenToggle}
              deliveriesToggle={this.state.deliveriesToggle}
              initialMarkers={this.state.initialMarkers}
              height="calc(100vh - 125px)"
            />
            <MapFilter
              foodBankToggle={this.state.foodBankToggle}
              communityGardenToggle={this.state.communityGardenToggle}
              handleFoodBankToggle={this.handleFoodBankToggle}
              handleCommunityGardenToggle={this.handleCommunityGardenToggle}
              handleMenuClick={this.handleMenuClick}
            />
            <BackButton />
          </div>
        );
      } else if (this.state.menu === "defaultMenu") {
        return (
          <div className="map-container">
            <Map
              coords={this.state.coords}
              foodBankToggle={this.state.foodBankToggle}
              communityGardenToggle={this.state.communityGardenToggle}
              deliveriesToggle={this.state.homeToggle}
              initialMarkers={this.state.initialMarkers}
              height="calc(100vh - 50px)"
            />
            <MapMenu handleMenuClick={this.handleMenuClick} />
            <BackButton />
          </div>
        );
      } else if (this.state.menu === "qrScanner") {
        return (
          <div className="QR-scanner">
            <QRScanner handleMenuClick={this.handleMenuClick} />
          </div>
        );
      }
    }
  }
}
export default MapPage;
