import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function CityMap({ cameras, center = [18.5204, 73.8567], zoom = 13 }) {
  const mapRef = useRef(null)

  const getTrafficColor = (level) => {
    switch (level) {
      case 'Low': return '#00E676'
      case 'Medium': return '#FFC107'
      case 'Heavy': return '#FF1744'
      default: return '#00B4FF'
    }
  }

  const getRadius = (level) => {
    switch (level) {
      case 'Low': return 15
      case 'Medium': return 30
      case 'Heavy': return 50
      default: return 20
    }
  }

  // Ensure map container has height
  useEffect(() => {
    // Fix for Leaflet map rendering
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize()
      }, 100)
    }
  }, [])

  return (
    <div className="glass-card overflow-hidden h-[400px] w-full relative">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-map-tiles"
        />
        
        {cameras && cameras.map((camera, index) => {
          // Handle different coordinate formats
          const lat = camera.lat || camera.latitude || 0
          const lng = camera.lng || camera.longitude || 0
          
          // Skip if no valid coordinates
          if (!lat || !lng) return null
          
          return (
            <React.Fragment key={index}>
              <Circle
                center={[lat, lng]}
                radius={getRadius(camera.trafficLevel)}
                pathOptions={{
                  color: getTrafficColor(camera.trafficLevel),
                  fillColor: getTrafficColor(camera.trafficLevel),
                  fillOpacity: 0.3,
                  weight: 2,
                }}
              />
              <Marker
                position={[lat, lng]}
                icon={L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div style="background-color: ${getTrafficColor(camera.trafficLevel)}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5);"></div>`,
                  iconSize: [12, 12],
                  iconAnchor: [6, 6],
                })}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-bold text-dark">{camera.name}</p>
                    <p className="text-sm text-gray-600">{camera.location || 'Unknown'}</p>
                    <p className="text-xs mt-1">
                      Traffic: <span className="font-medium">{camera.trafficLevel || 'Low'}</span>
                    </p>
                    <p className="text-xs">
                      Vehicles: <span className="font-medium">{camera.vehicleCount || 0}</span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          )
        })}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-card px-3 py-2 flex items-center gap-3 text-xs z-[1000]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-gray-400">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-warning" />
          <span className="text-gray-400">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-danger" />
          <span className="text-gray-400">Heavy</span>
        </div>
      </div>
    </div>
  )
}

export default CityMap