'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FlyToSelected({ selectedSatpas }) {
  const map = useMap();

  useEffect(() => {
    if (selectedSatpas?.latitude && selectedSatpas?.longitude) {
      map.flyTo([selectedSatpas.latitude, selectedSatpas.longitude], 14, {
        duration: 1,
      });
    }
  }, [selectedSatpas, map]);

  return null;
}

export default function MapComponent({ satpasList, selectedSatpas, onSelectSatpas }) {
  const defaultCenter = [-6.2088, 106.8456];
  const mapRef = useRef(null);

  const center = satpasList.length > 0
    ? [
      satpasList.reduce((sum, s) => sum + (parseFloat(s.latitude) || 0), 0) / satpasList.length,
      satpasList.reduce((sum, s) => sum + (parseFloat(s.longitude) || 0), 0) / satpasList.length,
    ]
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={10}
      scrollWheelZoom={true}
      className="w-full h-[400px] rounded-xl z-0"
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToSelected selectedSatpas={selectedSatpas} />

      {satpasList.map((satpas) => (
        satpas.latitude && satpas.longitude && (
          <Marker
            key={satpas.satpas_id}
            position={[satpas.latitude, satpas.longitude]}
            icon={selectedSatpas?.satpas_id === satpas.satpas_id ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => onSelectSatpas(satpas),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-gray-900 mb-1">{satpas.name}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  {Number(satpas.latitude)?.toFixed(6)}, {Number(satpas.longitude)?.toFixed(6)}
                </p>
                <button
                  onClick={() => onSelectSatpas(satpas)}
                  className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedSatpas?.satpas_id === satpas.satpas_id ? '✓ Terpilih' : 'Pilih Satpas Ini'}
                </button>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
