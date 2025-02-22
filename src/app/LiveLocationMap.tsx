"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const LiveLocationMap = () => {
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
        <div>
            <h1>Real-Time Location 🌍</h1>
            {userLocation ? (
                <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={15} style={{ height: "400px", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[userLocation.latitude, userLocation.longitude]}>
                        <Popup>You are here! 📍</Popup>
                    </Marker>

                </MapContainer>
            ) : (
                <p>Fetching location...</p>
            )}
        </div>
    );
};

export default LiveLocationMap;




