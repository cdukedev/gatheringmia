import React from 'react';
import { useRouter } from 'next/router';
import DirectionsMap from '../../pages/DirectionsMap/DirectionsMap';

export default function Directions() {
  const router = useRouter();
  const { params } = router.query;

  // If params are not loaded yet or not enough params, show loading
  if (!params || params.length < 4) {
    return <div>Loading...</div>;
  }

  const [userLat, userLng, destinationLat, destinationLng] = params;

  return (
    <DirectionsMap
      userLat={userLat}
      userLng={userLng}
      destinationLat={destinationLat}
      destinationLng={destinationLng}
    />
  );
}