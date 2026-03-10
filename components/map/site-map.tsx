// components/maps/site-map.tsx
'use client'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060, // Default to New York
};

interface SiteMapProps {
  latitude?: string | number;
  longitude?: string | number;
  siteName?: string;
}

export function SiteMap({ latitude, longitude, siteName }: SiteMapProps) {
  const center = latitude && longitude ? {
    lat: Number(latitude),
    lng: Number(longitude),
  } : defaultCenter;

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {latitude && longitude && (
          <Marker
            position={center}
            title={siteName || 'Site Location'}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}