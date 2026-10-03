import React from 'react';
import Head from 'next/head';
import '../App.css';
import '../index.css';
import { FoodBankProvider } from "../contexts/FoodBankContext";
import { CommunityGardenProvider } from "../contexts/CommunityGardenContext";
import { RecipientProvider } from "../contexts/RecipientContext";
import { GeolocationProvider } from "../contexts/GeolocationContext";
import { MapPageProvider } from "../contexts/MapPageContext";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <FoodBankProvider>
      <CommunityGardenProvider>
        <RecipientProvider>
          <GeolocationProvider>
            <MapPageProvider>
              <Head>
                <title>Feed Our Community</title>
              </Head>
              <Component {...pageProps} />
            </MapPageProvider>
          </GeolocationProvider>
        </RecipientProvider>
      </CommunityGardenProvider>
    </FoodBankProvider>
  );
}