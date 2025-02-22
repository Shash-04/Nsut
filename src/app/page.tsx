"use client"
import React from 'react'
import MapComponent from './MapComponents'
import dynamic from "next/dynamic";
import LiveLocationMap from './LiveLocationMap';

// const MapComponent = dynamic(() => import("@/app/MapComponents"), {
//   ssr: true, // Ensures Leaflet runs only in the browser
// });


function page() {
  return (
    <div className='  '>
      <MapComponent />
      {/* <LiveLocationMap /> */}
    </div>
  )
}

export default page
