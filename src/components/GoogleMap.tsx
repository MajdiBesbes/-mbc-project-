import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const MapComponent: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  
  const mapStyles = {
    height: "400px",
    width: "100%"
  };

  const defaultCenter = {
    lat: 48.960175,
    lng: 2.878192
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Show a more informative message when the API key is missing or invalid
  if (!apiKey || apiKey === 'your_google_maps_api_key') {
    return (
      <div className="h-[400px] bg-gray-100 flex items-center justify-center flex-col gap-4 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-600 text-center">La carte Google Maps n'est pas disponible pour le moment.</p>
        <p className="text-sm text-gray-500 text-center">Veuillez configurer une clé API Google Maps valide dans les paramètres de l'application.</p>
        <div className="text-sm text-gray-500">
          <p className="font-medium mb-2">Notre adresse :</p>
          <p>MBC Consulting</p>
          <p>39 Avenue des Sablons Brouillants</p>
          <p>77100 Meaux, France</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} loadingElement={<div className="h-[400px] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={15}
        center={defaultCenter}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#7c93a3" }, { lightness: -10 }]
            },
            {
              featureType: "administrative.country",
              elementType: "geometry",
              stylers: [{ visibility: "on" }]
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [{ color: "#a0a4a5" }]
            },
            {
              featureType: "administrative.province",
              elementType: "geometry.stroke",
              stylers: [{ color: "#62838e" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry.fill",
              stylers: [{ color: "#f5f5f5" }]
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#a6cbe3" }]
            }
          ]
        }}
      >
        <Marker 
          position={defaultCenter} 
          onClick={() => setShowInfo(true)}
          icon={{
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgMkM5LjQ4IDIgNSA2LjQ4IDUgMTJDNSAxOC42OSAxNSAyOCAxNSAyOEMxNSAyOCAyNSAxOC42OSAyNSAxMkMyNSA2LjQ4IDIwLjUyIDIgMTUgMloiIGZpbGw9IiMwMDU1QTQiLz48cGF0aCBkPSJNMTUgMTZDMTcuMjA5MSAxNiAxOSAxNC4yMDkxIDE5IDEyQzE5IDkuNzkwODYgMTcuMjA5MSA4IDE1IDhDMTIuNzkwOSA4IDExIDkuNzkwODYgMTEgMTJDMTEgMTQuMjA5MSAxMi43OTA5IDE2IDE1IDE2WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
            scaledSize: new window.google.maps.Size(40, 40)
          }}
        />
        
        {showInfo && (
          <InfoWindow
            position={defaultCenter}
            onCloseClick={() => setShowInfo(false)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-gray-900 mb-2">MBC Consulting</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span className="ml-2">39 Avenue des Sablons Brouillants, 77100 Meaux</span>
                </div>
                <div className="flex items-start">
                  <Phone className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span className="ml-2">06 76 57 00 97</span>
                </div>
                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span className="ml-2">majdi.besbes@gmail.com</span>
                </div>
                <div className="flex items-start">
                  <Clock className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span className="ml-2">Lun-Ven: 9h00-18h00</span>
                </div>
              </div>
              <div className="mt-2">
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=48.960175,2.878192" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Itinéraire
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;