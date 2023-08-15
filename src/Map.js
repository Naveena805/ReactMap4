import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import './Map.css'

const center = {
  lat: 10.56,
  lng: 76.56,
};

const pinkIcon = new L.Icon({
  iconUrl: 'data:image/jpeg;base64,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',
 iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const Map = () => {
  const [busStops, setBusStops] = useState([]);

  useEffect(() => {
    axios
      .get('https://busparrot.com/pis/api/getstopsin.php', {
        params: {
          center_lat: center.lat,
          center_lon: center.lng,
          radius: 10,
        },
      })
      .then((response) => {
        console.log('API Response:', response.data.stops); // Log the response to the console

        if (response.data) {
          // Check if the response has a 'bus_stops' property
          const busStopsData = response.data.stops || [];
          setBusStops(busStopsData);
        }
      })
      .catch((error) => {
        console.error('Error fetching bus stops:', error);
      });
  }, []);

  return (
    <div className='div1 container-fluid'>
    <h1 className='h1' style={{animation: 'blinking 2s infinite'}}><u>Bus Routes</u></h1>
  
    <div className='div2 container-fluid'>
    <MapContainer className='container-fluid' center={center} zoom={12} style={{ height: '800px', width: '100%' }}>
      <TileLayer className='container-fluid'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors'
      />

      {busStops.map((stops) => (
        <Marker
          key={stops.stop_id}
          position={[stops.stop_lat, stops.stop_lon]}
          icon={pinkIcon}
        >
          <Popup>
            <div style={{color:'red',backgroundColor:"wheat"}}>
            
            <h1>{stops.stop_name}</h1>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </div>
    </div>
  );
};

export default Map;
