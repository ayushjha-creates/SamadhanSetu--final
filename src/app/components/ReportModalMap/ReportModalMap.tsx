'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const LeafletMap = dynamic(() => import('../LeafletMap/LeafletMap'), { ssr: false });

interface ReportModalMapProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  selectedLocation?: { lat: number; lng: number };
}

export default function ReportModalMap({ onLocationSelect, selectedLocation }: ReportModalMapProps) {
  const [location, setLocation] = useState(selectedLocation || { lat: 23.2599, lng: 77.4126 });

  const handleMapClick = (loc: { lat: number; lng: number }) => {
    setLocation(loc);
    onLocationSelect({ ...loc, address: `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}` });
  };

  return (
    <div className="map-wrapper">
      <LeafletMap
        center={[location.lat, location.lng]}
        markers={[{ position: [location.lat, location.lng], popup: 'Selected Location', type: 'issue' }]}
        onMapClick={handleMapClick}
        height="300px"
      />
      <style jsx>{`
        .map-wrapper { border-radius: 12px; overflow: hidden; }
      `}</style>
    </div>
  );
}