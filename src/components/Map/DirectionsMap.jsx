import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const DirectionsMap = ({ userLocation, destination }) => {
  const mapRef = useRef(null);
  const [directions, setDirections] = useState(null);

  // Calculate and render route between userLocation and destination
  const calculateRoute = useCallback(() => {
    if (!userLocation || !destination) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: userLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  }, [userLocation, destination]);

  useEffect(() => {
    if (userLocation && destination) {
      calculateRoute();
    }
  }, [userLocation, destination, calculateRoute]);

  return (
    <GoogleMap
      ref={mapRef}
      center={userLocation}
      zoom={14}
      mapContainerStyle={{ width: "100%", height: "400px" }}
      options={{
        zoomControl: true,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        clickableIcons: false,
      }}
    >
      {userLocation && <Marker position={userLocation} label="You are here" />}
      {destination && <Marker position={destination} label="Destination" />}

      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default DirectionsMap;
