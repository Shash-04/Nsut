"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import { useMap } from 'react-leaflet';  // Add this import

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Add this new component to handle map view changes
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

const MapComponent = () => {
  
  const [tempCoords, setTempCoords] = useState({
    latitude: "28.6139",
    longitude: "77.2088"
  });

  const [mapPosition, setMapPosition] = useState({
    latitude: 28.6139,
    longitude: 77.2088
  });

  const [error, setError] = useState("");

  const validateCoordinates = (lat: number, lng: number): boolean => {
    if (lat < -90 || lat > 90) {
      setError("Latitude must be between -90 and 90 degrees");
      return false;
    }
    if (lng < -180 || lng > 180) {
      setError("Longitude must be between -180 and 180 degrees");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parseFloat(tempCoords.latitude);
    const lng = parseFloat(tempCoords.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError("Please enter valid numbers for coordinates");
      return;
    }

    if (validateCoordinates(lat, lng)) {
      setMapPosition({
        latitude: lat,
        longitude: lng
      });
      console.log(`New Marker at: ${lat}, ${lng}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempCoords(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Location access is required for this feature.");
        }
      );
    } else {
      console.log("Geolocation is not available");
      alert("Geolocation is not supported by your browser.");
    }
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {userLocation ? (
        <MapContainer
          center={[mapPosition.latitude, mapPosition.longitude]}
          zoom={11}
          style={{ height: "400px", width: "100%" }}
        >
          {/* Add the ChangeView component here */}
          <ChangeView center={[mapPosition.latitude, mapPosition.longitude]} />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[mapPosition.latitude, mapPosition.longitude]}
            icon={icon}
          >
            <Popup>Marker at: {mapPosition.latitude}, {mapPosition.longitude}</Popup>
          </Marker>
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>You are here! 📍</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Fetching location...</p>
      )}

      <div className='flex items-center justify-center'>
        <div style={{ maxWidth: "300px", margin: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Enter Location</h3>
          {error && (
            <div style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
              {error}
            </div>
          )}
          <form className="text-black" onSubmit={handleSubmit}>
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={tempCoords.latitude}
              onChange={handleInputChange}
              step="any"
              required
              style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={tempCoords.longitude}
              onChange={handleInputChange}
              step="any"
              required
              style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "8px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px"
              }}
            >
              Submit
            </button>
          </form>
        </div>
        <div>
          <h1 className='text-xl'>The distance between Your Location and Coords are:</h1>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;