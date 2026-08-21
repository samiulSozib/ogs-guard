// components/map/site-map.tsx
'use client'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useMemo, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

interface SiteMapProps {
  latitude?: string | number;
  longitude?: string | number;
  siteName?: string;
}

export function SiteMap({ latitude, longitude, siteName }: SiteMapProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  // Use a stable key based on coordinates instead of Date.now()
  const mapKey = useMemo(() => {
    return `${latitude || 0}-${longitude || 0}-${siteName || ''}`;
  }, [latitude, longitude, siteName]);

  const center = useMemo(() => {
    return latitude && longitude ? {
      lat: Number(latitude),
      lng: Number(longitude),
    } : defaultCenter;
  }, [latitude, longitude]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  if (!apiKey) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        <p className="text-sm text-gray-500">Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <LoadScript 
      key={mapKey}
      googleMapsApiKey={apiKey}
      onLoad={() => setIsScriptLoaded(true)}
    >
      {!isScriptLoaded && (
        <div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <Loader2 className="h-6 w-6 animate-spin text-[#6b0015]" />
        </div>
      )}
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