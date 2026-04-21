'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
    type?: 'issue' | 'user';
  }>;
  onMapClick?: (location: Location) => void;
  showUserLocation?: boolean;
  height?: string;
}

export default function LeafletMap({
  center = [23.2599, 77.4126],
  zoom = 13,
  markers = [],
  onMapClick,
  showUserLocation = false,
  height = '400px',
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const L = await import('leaflet');

      // If map already exists, just update it
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(center, zoom);
        
        // Clear existing markers
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.Marker || layer instanceof L.TileLayer) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });

        // Add markers
        markers.forEach((marker) => {
          const color = marker.type === 'user' ? '#2ecc71' : '#e74c3c';
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          L.marker(marker.position, { icon }).addTo(mapInstanceRef.current)
            .bindPopup(marker.popup || '');
        });

        setMapLoaded(true);
        return;
      }

      // Create new map
      if (mapRef.current) {
        // Clean up any existing content
        mapRef.current.innerHTML = '';
        
        const map = L.map(mapRef.current, {
          center: center,
          zoom: zoom,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        markers.forEach((marker) => {
          const color = marker.type === 'user' ? '#2ecc71' : '#e74c3c';
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          L.marker(marker.position, { icon }).addTo(map)
            .bindPopup(marker.popup || '');
        });

        if (onMapClick) {
          map.on('click', (e: any) => {
            onMapClick({
              lat: e.latlng.lat,
              lng: e.latlng.lng,
            });
          });
        }

        if (showUserLocation && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], 14);
              L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup('You are here')
                .openPopup();
            },
            (error) => console.error('Geolocation error:', error)
          );
        }

        mapInstanceRef.current = map;
        setMapLoaded(true);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers, onMapClick, showUserLocation]);

  return <div ref={mapRef} style={{ height, width: '100%', borderRadius: '12px' }} />;
}