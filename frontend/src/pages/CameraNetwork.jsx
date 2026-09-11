import React, { useEffect, useState } from 'react'
import {
  Camera,
  MapPin,
  Search,
  Plus,
  X,
  CheckCircle,
  XCircle,
  Wifi,
  RefreshCw,
  Trash2,
  WifiOff,
  Upload,
  Video,
  FileVideo,
  Map,
  MousePointer,
  Navigation,
  Smartphone,
  Laptop,
  Globe
} from 'lucide-react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMapEvents,
  ZoomControl,
  useMap
} from 'react-leaflet'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import apiService from '../services/api'

// ============================================================
// LEAFLET DEFAULT ICON FIX
// ============================================================

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})

// ============================================================
// PUNE MAP CONFIGURATION
// ============================================================

const PUNE_CENTER = [18.5204, 73.8567]

const PUNE_BOUNDARY = [
  [18.7000, 73.6500],
  [18.7200, 73.7500],
  [18.7100, 73.8500],
  [18.6800, 73.9500],
  [18.6200, 74.0000],
  [18.5500, 73.9800],
  [18.4800, 73.9400],
  [18.4500, 73.8800],
  [18.4600, 73.8000],
  [18.4900, 73.7200],
  [18.5500, 73.6500],
  [18.6500, 73.6300],
  [18.7000, 73.6500]
]

const TRINETRA_REGION = [
  [18.6500, 73.7000],
  [18.6600, 73.7800],
  [18.6400, 73.8600],
  [18.6000, 73.9200],
  [18.5500, 73.9000],
  [18.5000, 73.8600],
  [18.4800, 73.8000],
  [18.5000, 73.7400],
  [18.5500, 73.7000],
  [18.6000, 73.6800],
  [18.6500, 73.7000]
]

// ============================================================
// POPULAR PUNE LOCATIONS
// ============================================================

const popularLocations = [
  // North Pune
  { name: 'Bhosari', lat: 18.6200, lng: 73.8500 },
  { name: 'Pimpri', lat: 18.6298, lng: 73.7997 },
  { name: 'Chinchwad', lat: 18.6298, lng: 73.7813 },
  { name: 'Nigdi', lat: 18.6500, lng: 73.7600 },
  { name: 'Ravet', lat: 18.6400, lng: 73.7400 },
  { name: 'Akurdi', lat: 18.6400, lng: 73.7700 },
  { name: 'Thergaon', lat: 18.6300, lng: 73.7900 },
  { name: 'Kalewadi', lat: 18.6200, lng: 73.8100 },
  { name: 'Sangvi', lat: 18.5900, lng: 73.8200 },
  { name: 'Khadki', lat: 18.5700, lng: 73.8300 },
  
  // West Pune
  { name: 'Wakad', lat: 18.5990, lng: 73.7637 },
  { name: 'Hinjawadi', lat: 18.5912, lng: 73.7389 },
  { name: 'Baner', lat: 18.5590, lng: 73.7868 },
  { name: 'Aundh', lat: 18.5580, lng: 73.8070 },
  { name: 'Balewadi', lat: 18.5600, lng: 73.7700 },
  { name: 'Pashan', lat: 18.5400, lng: 73.7900 },
  { name: 'Sus', lat: 18.5700, lng: 73.7700 },
  { name: 'Mhalunge', lat: 18.5800, lng: 73.7800 },
  
  // Central Pune
  { name: 'Shivajinagar', lat: 18.5300, lng: 73.8500 },
  { name: 'Deccan', lat: 18.5200, lng: 73.8300 },
  { name: 'Pune Station', lat: 18.5300, lng: 73.8700 },
  { name: 'Camp', lat: 18.5150, lng: 73.8800 },
  { name: 'Swargate', lat: 18.4950, lng: 73.8550 },
  { name: 'Sadashiv Peth', lat: 18.5100, lng: 73.8600 },
  { name: 'Narayan Peth', lat: 18.5100, lng: 73.8500 },
  { name: 'Kasba Peth', lat: 18.5200, lng: 73.8700 },
  { name: 'Koregaon Park', lat: 18.5360, lng: 73.8950 },
  { name: 'Kalyani Nagar', lat: 18.5400, lng: 73.9000 },
  
  // East Pune
  { name: 'Viman Nagar', lat: 18.5600, lng: 73.9100 },
  { name: 'Kharadi', lat: 18.5480, lng: 73.9400 },
  { name: 'Hadapsar', lat: 18.5000, lng: 73.9200 },
  { name: 'Magarpatta', lat: 18.5100, lng: 73.9300 },
  { name: 'Keshav Nagar', lat: 18.5200, lng: 73.9500 },
  { name: 'Mundhwa', lat: 18.5400, lng: 73.9300 },
  
  // South Pune
  { name: 'Katraj', lat: 18.4500, lng: 73.8600 },
  { name: 'Kondhwa', lat: 18.4600, lng: 73.8900 },
  { name: 'Bibwewadi', lat: 18.4800, lng: 73.8700 },
  { name: 'Wanowrie', lat: 18.4900, lng: 73.8900 },
  { name: 'Yerawada', lat: 18.5500, lng: 73.8900 },
  
  // Other Areas
  { name: 'Kothrud', lat: 18.5100, lng: 73.8100 },
  { name: 'Erandwane', lat: 18.5300, lng: 73.8200 },
  { name: 'Karve Nagar', lat: 18.5200, lng: 73.8100 },
  { name: 'Bavdhan', lat: 18.5300, lng: 73.7800 },
  { name: 'Rajgurunagar', lat: 18.8600, lng: 73.8900 },
  { name: 'Vishrantwadi', lat: 18.5700, lng: 73.8700 },
  { name: 'Dhanori', lat: 18.5800, lng: 73.8800 },
  { name: 'Lohegaon', lat: 18.5900, lng: 73.9200 },
]

// ============================================================
// CUSTOM CAMERA ICON
// ============================================================

const createCustomIcon = (status = 'offline') => {
  const online = status === 'online'
  const color = online ? '#00E676' : '#FF1744'
  const glow = online ? '0 0 18px rgba(0,230,118,.7)' : '0 0 18px rgba(255,23,68,.5)'

  return L.divIcon({
    className: 'trinetra-camera-marker',
    html: `
      <div style="
        position: relative;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid white;
        box-shadow: ${glow};
      ">
        ${
          online
            ? `
              <div style="
                position:absolute;
                left:-6px;
                top:-6px;
                width:24px;
                height:24px;
                border-radius:50%;
                border:2px solid ${color};
                opacity:.45;
                animation: trinetra-ping 1.5s infinite;
              "></div>
            `
            : ''
        }
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  })
}

// ============================================================
// SELECTED LOCATION ICON
// ============================================================

const selectedLocationIcon = L.divIcon({
  className: 'trinetra-selected-marker',
  html: `
    <div style="
      width: 22px;
      height: 22px;
      background: #00B8FF;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 25px rgba(0,184,255,.9);
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
})

// ============================================================
// MAP CLICK LOCATION PICKER
// ============================================================

function LocationPicker({ isActive, onSelect }) {
  useMapEvents({
    click(event) {
      if (!isActive) return
      const { lat, lng } = event.latlng
      onSelect({
        lat,
        lng,
        name: 'Custom Location',
        isCustom: true
      })
    }
  })
  return null
}

// ============================================================
// MAP FLY TO LOCATION
// ============================================================

function MapController({ selectedLocation }) {
  const map = useMap()
  useEffect(() => {
    if (!selectedLocation) return
    map.flyTo([selectedLocation.lat, selectedLocation.lng], 14, { duration: 1 })
  }, [selectedLocation, map])
  return null
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function CameraNetwork() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [cameras, setCameras] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddCamera, setShowAddCamera] = useState(false)
  const [cameraType, setCameraType] = useState('phone')
  const [locationPickerActive, setLocationPickerActive] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    port: 8080,
    location: '',
    latitude: '',
    longitude: '',
    id: 0
  })
  const [videoFile, setVideoFile] = useState(null)
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // ==========================================================
  // LOAD CAMERAS
  // ==========================================================

  useEffect(() => {
    fetchCameras()
  }, [])

  const fetchCameras = async () => {
    try {
      setRefreshing(true)
      const response = await apiService.getCameras()
      const cameraData = response?.cameras || []
      const normalized = cameraData.map(camera => ({
        ...camera,
        latitude: camera.latitude ?? camera.lat ?? null,
        longitude: camera.longitude ?? camera.lng ?? null,
        status: camera.status || 'offline'
      }))
      setCameras(normalized)
    } catch (error) {
      console.error('❌ Camera fetch error:', error)
      setMessage({
        type: 'error',
        text: 'Unable to load cameras from backend.'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // ==========================================================
  // LOCATION SELECTION
  // ==========================================================

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setFormData(prev => ({
      ...prev,
      location: location.name,
      latitude: location.lat,
      longitude: location.lng
    }))
    setLocationPickerActive(false)
  }

  // ==========================================================
  // POPULAR LOCATION CHANGE
  // ==========================================================

  const handlePopularLocation = (event) => {
    const name = event.target.value
    if (!name) return
    const location = popularLocations.find(item => item.name === name)
    if (!location) return
    handleLocationSelect({
      name: location.name,
      lat: location.lat,
      lng: location.lng,
      isCustom: false
    })
  }

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // ==========================================================
  // ADD CAMERA
  // ==========================================================

  const handleAddCamera = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      if (!formData.name.trim()) {
        throw new Error('Please enter camera name.')
      }

      // Phone Camera
      if (cameraType === 'phone') {
        if (!formData.ip.trim()) {
          throw new Error('Please enter camera IP address.')
        }

        const response = await fetch('http://localhost:8000/api/camera/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'phone',
            ip: formData.ip.trim(),
            port: Number(formData.port) || 8080,
            name: formData.name,
            location: formData.location || 'Pune',
            latitude: Number(formData.latitude) || null,
            longitude: Number(formData.longitude) || null
          })
        })

        const data = await response.json()
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to add camera.')
        }
      }

      // Laptop Camera
      else if (cameraType === 'laptop') {
        const response = await fetch('http://localhost:8000/api/camera/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'laptop',
            id: Number(formData.id) || 0,
            name: formData.name,
            location: formData.location || 'Pune',
            latitude: Number(formData.latitude) || null,
            longitude: Number(formData.longitude) || null
          })
        })

        const data = await response.json()
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to add laptop camera.')
        }
      }

      // Video Camera
      else if (cameraType === 'video') {
        if (!videoFile) {
          throw new Error('Please select a video file.')
        }

        const body = new FormData()
        body.append('file', videoFile)
        body.append('name', formData.name)
        body.append('location', formData.location || 'Virtual')

        const response = await fetch('http://localhost:8000/api/camera/upload_video', {
          method: 'POST',
          body
        })

        const data = await response.json()
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Video upload failed.')
        }
      }

      setMessage({ type: 'success', text: 'Camera added successfully.' })
      setShowAddCamera(false)
      setVideoFile(null)
      setSelectedLocation(null)
      setFormData({ name: '', ip: '', port: 8080, location: '', latitude: '', longitude: '', id: 0 })
      await fetchCameras()

    } catch (error) {
      console.error('❌ Add camera error:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to add camera.' })
    } finally {
      setSubmitting(false)
    }
  }

  // ==========================================================
  // REMOVE CAMERA
  // ==========================================================

  const handleRemoveCamera = async (cameraId) => {
    const confirmed = window.confirm('Are you sure you want to remove this camera?')
    if (!confirmed) return

    try {
      const response = await fetch(`http://localhost:8000/api/camera/${cameraId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to remove camera.')
      }

      setCameras(prev => prev.filter(camera => camera.id !== cameraId))
      setMessage({ type: 'success', text: 'Camera removed successfully.' })

    } catch (error) {
      console.error('❌ Remove camera error:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to remove camera.' })
    }
  }

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredCameras = cameras.filter(camera => {
    const text = (
      `${camera.name || ''} ${camera.location || ''} ${camera.id || ''} ${camera.ip || ''}`
    ).toLowerCase()
    return text.includes(searchQuery.toLowerCase())
  })

  // ==========================================================
  // COUNTS
  // ==========================================================

  const onlineCount = cameras.filter(camera => camera.status === 'online').length
  const offlineCount = cameras.length - onlineCount
  const mappedCount = cameras.filter(c => c.latitude != null && c.longitude != null).length

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading Camera Network...</p>
        </div>
      </div>
    )
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* =====================================================
          ANIMATION
      ===================================================== */}

      <style>
        {`
          @keyframes trinetra-ping {
            0% { transform: scale(.7); opacity: .7; }
            70% { transform: scale(1.4); opacity: 0; }
            100% { transform: scale(1.4); opacity: 0; }
          }
          .leaflet-container {
            background: #111827;
            font-family: inherit;
          }
          .leaflet-popup-content-wrapper,
          .leaflet-popup-tip {
            background: #111827;
            color: white;
          }
          .leaflet-control-zoom a {
            background: #111827 !important;
            color: white !important;
            border-color: #374151 !important;
          }
          .leaflet-control-attribution {
            background: rgba(17,24,39,.85) !important;
            color: #9ca3af !important;
          }
          .leaflet-control-attribution a {
            color: #60a5fa !important;
          }
        `}
      </style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Camera Network</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage and monitor all TRINETRA surveillance cameras
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchCameras()}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => setShowAddCamera(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Camera
          </button>
        </div>
      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <div className={`rounded-xl p-4 flex items-center justify-between border ${
          message.type === 'success'
            ? 'bg-success/10 border-success/30'
            : 'bg-danger/10 border-danger/30'
        }`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-danger" />
            )}
            <span className="text-sm text-white">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)}>
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Cameras</p>
              <p className="text-xl font-bold text-white">{cameras.length}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-2 border-success">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Wifi className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Online</p>
              <p className="text-xl font-bold text-success">{onlineCount}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-2 border-danger">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-danger/10">
              <WifiOff className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Offline</p>
              <p className="text-xl font-bold text-danger">{offlineCount}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Map className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Mapped</p>
              <p className="text-xl font-bold text-white">{mappedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAP
      ===================================================== */}

      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              Pune Camera Network
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Select a location by clicking anywhere on the map
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocationPickerActive(prev => !prev)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                locationPickerActive
                  ? 'bg-primary text-white'
                  : 'btn-secondary'
              }`}
            >
              <MousePointer className="w-4 h-4" />
              {locationPickerActive ? 'Click Map to Select' : 'Select Location'}
            </button>
          </div>
        </div>

        {/* MAP CONTAINER */}
        <div
          className="w-full rounded-xl overflow-hidden border border-dark-border"
          style={{ height: '520px' }}
        >
          <MapContainer
            center={PUNE_CENTER}
            zoom={11}
            scrollWheelZoom={true}
            zoomControl={false}
            className="w-full h-full"
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ZoomControl position="bottomright" />

            <Polygon
              positions={PUNE_BOUNDARY}
              pathOptions={{
                color: '#00B8FF',
                weight: 2,
                fillOpacity: 0.03
              }}
            />

            <Polygon
              positions={TRINETRA_REGION}
              pathOptions={{
                color: '#7C4DFF',
                weight: 2,
                fillOpacity: 0.05
              }}
            />

            {/* EXISTING CAMERAS */}
            {cameras.map(camera => {
              if (camera.latitude == null || camera.longitude == null) return null
              const lat = Number(camera.latitude)
              const lng = Number(camera.longitude)
              if (Number.isNaN(lat) || Number.isNaN(lng)) return null

              return (
                <Marker
                  key={camera.id}
                  position={[lat, lng]}
                  icon={createCustomIcon(camera.status)}
                >
                  <Popup>
                    <div style={{ minWidth: '180px' }}>
                      <strong>{camera.name || camera.id}</strong><br />
                      <span>{camera.location || 'Unknown location'}</span><br />
                      <span>Status: {camera.status || 'unknown'}</span><br />
                      <span>{lat.toFixed(6)}, {lng.toFixed(6)}</span>
                    </div>
                  </Popup>
                </Marker>
              )
            })}

            {/* SELECTED LOCATION */}
            {selectedLocation && (
              <Marker
                position={[selectedLocation.lat, selectedLocation.lng]}
                icon={selectedLocationIcon}
              >
                <Popup>
                  <strong>Selected Camera Location</strong><br />
                  {selectedLocation.name}<br />
                  <span>{selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</span>
                </Popup>
              </Marker>
            )}

            <LocationPicker
              isActive={locationPickerActive}
              onSelect={handleLocationSelect}
            />

            <MapController selectedLocation={selectedLocation} />
          </MapContainer>
        </div>

        {/* SELECTED LOCATION INFO */}
        {selectedLocation && (
          <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-400">Selected Camera Location</p>
                <p className="text-white font-semibold mt-1">{selectedLocation.name}</p>
                <p className="text-xs text-gray-400 font-mono mt-1">
                  Latitude: {selectedLocation.lat.toFixed(6)} &nbsp; Longitude: {selectedLocation.lng.toFixed(6)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAddCamera(true)
                  setCameraType('phone')
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Camera Here
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          CAMERA LIST
      ===================================================== */}

      <div className="glass-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Connected Cameras</h2>
            <p className="text-xs text-gray-500 mt-1">{filteredCameras.length} camera(s) displayed</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search cameras..."
              className="bg-dark-hover border border-dark-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {filteredCameras.length === 0 ? (
          <div className="py-12 text-center">
            <Camera className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No cameras found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCameras.map(camera => (
              <div key={camera.id} className="p-4 rounded-xl bg-dark-hover border border-dark-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      camera.status === 'online' ? 'bg-success/10' : 'bg-danger/10'
                    }`}>
                      {camera.type === 'phone' ? (
                        <Smartphone className={`w-5 h-5 ${camera.status === 'online' ? 'text-success' : 'text-danger'}`} />
                      ) : camera.type === 'video' ? (
                        <Video className="w-5 h-5 text-secondary" />
                      ) : (
                        <Camera className={`w-5 h-5 ${camera.status === 'online' ? 'text-success' : 'text-danger'}`} />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white">{camera.name || camera.id}</h3>
                      <p className="text-xs text-gray-500">{camera.type || 'camera'}</p>
                    </div>
                  </div>

                  <span className={`text-xs px-2 py-1 rounded-full ${
                    camera.status === 'online' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                  }`}>
                    {camera.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{camera.location || 'Location not set'}</span>
                  </div>

                  {camera.ip && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Globe className="w-3.5 h-3.5" />
                      <span className="font-mono">{camera.ip}{camera.port ? `:${camera.port}` : ''}</span>
                    </div>
                  )}

                  {camera.latitude != null && camera.longitude != null && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <Navigation className="w-3.5 h-3.5" />
                      {Number(camera.latitude).toFixed(5)}, {Number(camera.longitude).toFixed(5)}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-dark-border">
                  <button
                    onClick={() => handleRemoveCamera(camera.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Camera
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          ADD CAMERA MODAL
      ===================================================== */}

      {showAddCamera && (
        <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-dark-card border border-dark-border rounded-2xl shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between p-5 border-b border-dark-border">
              <div>
                <h2 className="text-lg font-bold text-white">Add Camera</h2>
                <p className="text-xs text-gray-500 mt-1">Connect a new camera to TRINETRA AI</p>
              </div>

              <button
                onClick={() => setShowAddCamera(false)}
                className="p-2 hover:bg-dark-hover rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* CAMERA TYPE */}
            <div className="p-5 border-b border-dark-border">
              <label className="text-xs text-gray-400 block mb-3">Camera Type</label>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setCameraType('phone')}
                  className={`p-3 rounded-xl border text-left ${
                    cameraType === 'phone' ? 'border-primary bg-primary/10' : 'border-dark-border bg-dark-hover'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-semibold text-white">IP Camera</p>
                  <p className="text-xs text-gray-500 mt-1">Phone / RTSP / HTTP</p>
                </button>

                <button
                  type="button"
                  onClick={() => setCameraType('laptop')}
                  className={`p-3 rounded-xl border text-left ${
                    cameraType === 'laptop' ? 'border-primary bg-primary/10' : 'border-dark-border bg-dark-hover'
                  }`}
                >
                  <Laptop className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-semibold text-white">Laptop</p>
                  <p className="text-xs text-gray-500 mt-1">Local webcam</p>
                </button>

                <button
                  type="button"
                  onClick={() => setCameraType('video')}
                  className={`p-3 rounded-xl border text-left ${
                    cameraType === 'video' ? 'border-primary bg-primary/10' : 'border-dark-border bg-dark-hover'
                  }`}
                >
                  <FileVideo className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-semibold text-white">Video</p>
                  <p className="text-xs text-gray-500 mt-1">Upload recording</p>
                </button>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleAddCamera} className="p-5 space-y-5">

              {/* NAME */}
              <div>
                <label className="text-xs text-gray-400 block mb-2">Camera Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Main Gate Camera"
                  className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* PHONE */}
              {cameraType === 'phone' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">IP Address</label>
                    <input
                      name="ip"
                      value={formData.ip}
                      onChange={handleInputChange}
                      placeholder="10.23.49.164"
                      className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Port</label>
                    <input
                      type="number"
                      name="port"
                      value={formData.port}
                      onChange={handleInputChange}
                      className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* LAPTOP */}
              {cameraType === 'laptop' && (
                <div>
                  <label className="text-xs text-gray-400 block mb-2">Camera Index</label>
                  <input
                    type="number"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              {/* VIDEO */}
              {cameraType === 'video' && (
                <div>
                  <label className="text-xs text-gray-400 block mb-2">Video File</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-dark-border rounded-xl p-8 cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 text-primary mb-3" />
                    <span className="text-sm text-white">{videoFile ? videoFile.name : 'Choose video file'}</span>
                    <span className="text-xs text-gray-500 mt-1">MP4, AVI, MOV, MKV, WEBM</span>
                    <input
                      type="file"
                      accept=".mp4,.avi,.mov,.mkv,.webm,video/*"
                      className="hidden"
                      onChange={e => setVideoFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              )}

              {/* LOCATION */}
              <div>
                <label className="text-xs text-gray-400 block mb-2">Camera Location</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* POPULAR LOCATIONS */}
                  <select
                    value=""
                    onChange={handlePopularLocation}
                    className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Pune Location</option>
                    {popularLocations.map(location => (
                      <option key={location.name} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </select>

                  {/* MAP BUTTON */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCamera(false)
                      setLocationPickerActive(true)
                    }}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <MousePointer className="w-4 h-4" />
                    Pick From Map
                  </button>
                </div>

                {/* LOCATION TEXT */}
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location name"
                  className="w-full mt-3 bg-dark-hover border border-dark-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />

                {/* COORDINATES */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Latitude</label>
                    <input
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="18.5204"
                      className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Longitude</label>
                    <input
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="73.8567"
                      className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {selectedLocation && (
                  <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-xs text-success">✓ Location selected</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                      {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCamera(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Camera
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CameraNetwork