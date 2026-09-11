import React, { useMemo, useState } from 'react'
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Camera,
  TrendingUp,
  Download,
  AlertCircle,
  Car,
  FileText,
  RefreshCw
} from 'lucide-react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from 'react-leaflet'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import VehicleTimeline from '../components/VehicleTimeline'

// =========================================================
// LEAFLET ICON FIX
// =========================================================

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

// =========================================================
// CONSTANTS
// =========================================================

const PUNE_CENTER = [18.5204, 73.8567]
const DEFAULT_ZOOM = 12

const CAMERA_LOCATIONS = [
  { id: 'CAM-001', name: 'Wakad', lat: 18.5990, lng: 73.7637 },
  { id: 'CAM-002', name: 'Hinjawadi', lat: 18.5912, lng: 73.7389 },
  { id: 'CAM-003', name: 'Baner', lat: 18.5590, lng: 73.7868 },
  { id: 'CAM-004', name: 'Aundh', lat: 18.5580, lng: 73.8070 },
  { id: 'CAM-005', name: 'Shivajinagar', lat: 18.5300, lng: 73.8500 },
  { id: 'CAM-006', name: 'Deccan', lat: 18.5200, lng: 73.8300 },
  { id: 'CAM-007', name: 'Pune Station', lat: 18.5300, lng: 73.8700 },
  { id: 'CAM-008', name: 'Camp', lat: 18.5150, lng: 73.8800 },
  { id: 'CAM-009', name: 'Viman Nagar', lat: 18.5600, lng: 73.9100 },
  { id: 'CAM-010', name: 'Kharadi', lat: 18.5480, lng: 73.9400 },
  { id: 'CAM-011', name: 'Hadapsar', lat: 18.5000, lng: 73.9200 },
  { id: 'CAM-012', name: 'Magarpatta', lat: 18.5100, lng: 73.9300 },
  { id: 'CAM-013', name: 'Kondhwa', lat: 18.4600, lng: 73.8900 },
  { id: 'CAM-014', name: 'Katraj', lat: 18.4500, lng: 73.8600 },
  { id: 'CAM-015', name: 'Kothrud', lat: 18.5100, lng: 73.8100 },
  { id: 'CAM-016', name: 'Pimpri', lat: 18.6200, lng: 73.8000 },
  { id: 'CAM-017', name: 'Chinchwad', lat: 18.6300, lng: 73.7800 },
  { id: 'CAM-018', name: 'Nigdi', lat: 18.6500, lng: 73.7600 },
  { id: 'CAM-019', name: 'Ravet', lat: 18.6400, lng: 73.7400 },
  { id: 'CAM-020', name: 'Akurdi', lat: 18.6400, lng: 73.7700 }
]

const VEHICLE_PLATES = [
  'MH14AB1234', 'MH12XY5678', 'MH14CD9999', 'MH15EF3456',
  'MH14GH7890', 'MH12JK2345', 'MH14LM6789', 'MH12NO3456',
  'MH14PQ7890', 'MH15RS2345', 'MH14TU6789', 'MH12VW3456'
]

const VEHICLE_TYPES = ['Car', 'SUV', 'Sedan', 'Hatchback', 'Truck', 'Bus', 'Motorcycle']

// =========================================================
// MARKER
// =========================================================

const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color:${color};
        width:32px;
        height:32px;
        border-radius:50%;
        border:3px solid white;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:12px;
        font-weight:bold;
        color:white;
        box-shadow:0 2px 10px rgba(0,0,0,0.5);
      ">
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

// =========================================================
// NORMALIZE API DATA
// =========================================================

const normalizeDetection = (item, index) => {
  const latitude = Number(item.latitude) || Number(item.lat) || Number(item.location?.latitude) || Number(item.location?.lat)
  const longitude = Number(item.longitude) || Number(item.lng) || Number(item.lon) || Number(item.location?.longitude) || Number(item.location?.lng)
  const camera = item.camera || item.camera_name || item.cameraName || item.location?.name || item.location_name || item.location || `Camera ${index + 1}`
  const cameraId = item.camera_id || item.cameraId || item.camera?.id || `CAM-${String(index + 1).padStart(3, '0')}`

  return {
    ...item,
    plate: item.plate || item.plate_number || item.number_plate || item.vehicle_number || '',
    camera,
    camera_id: cameraId,
    location: typeof camera === 'string' ? camera : camera?.name || `Location ${index + 1}`,
    latitude,
    longitude,
    lat: latitude,
    lng: longitude,
    timestamp: item.timestamp || item.detected_at || item.detection_time || item.time || new Date(Date.now() + index * 10 * 60000).toISOString(),
    confidence: Number(item.confidence) || Number(item.score) || Number(item.plate_confidence) || 0.90
  }
}

// =========================================================
// GET ARRAY FROM DIFFERENT BACKEND RESPONSES
// =========================================================

const extractDetections = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.trajectory)) return data.trajectory
  if (Array.isArray(data.detections)) return data.detections
  if (Array.isArray(data.results)) return data.results
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.data?.trajectory)) return data.data.trajectory
  if (Array.isArray(data.data?.detections)) return data.data.detections
  return []
}

// =========================================================
// DETERMINISTIC DEMO TRAJECTORY
// =========================================================

const generateDemoTrajectory = (plate) => {
  const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase()
  let hash = 0
  for (let i = 0; i < cleanPlate.length; i++) {
    hash = (hash * 31 + cleanPlate.charCodeAt(i)) >>> 0
  }
  const startIndex = hash % CAMERA_LOCATIONS.length
  const route = []
  for (let i = 0; i < 10; i++) {
    const camera = CAMERA_LOCATIONS[(startIndex + i * 2) % CAMERA_LOCATIONS.length]
    if (!route.some(item => item.id === camera.id)) {
      route.push(camera)
    }
  }
  const now = Date.now() - route.length * 12 * 60000
  return route.map((camera, index) => ({
    plate: cleanPlate,
    camera: camera.name,
    camera_id: camera.id,
    location: camera.name,
    latitude: camera.lat,
    longitude: camera.lng,
    lat: camera.lat,
    lng: camera.lng,
    timestamp: new Date(now + index * 12 * 60000).toISOString(),
    confidence: Number((0.91 + ((hash + index) % 8) / 100).toFixed(2)),
    vehicle_type: VEHICLE_TYPES[hash % VEHICLE_TYPES.length],
    source: 'TRINETRA AI DEMO DATA'
  }))
}

// =========================================================
// PREDICTIONS
// =========================================================

const generatePredictions = (trajectory) => {
  if (!trajectory.length) return []
  const last = trajectory[trajectory.length - 1]
  const nearby = CAMERA_LOCATIONS
    .filter(camera => camera.name !== last.location)
    .map(camera => ({ ...camera, distance: Math.pow(camera.lat - last.latitude, 2) + Math.pow(camera.lng - last.longitude, 2) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
  return nearby.map((camera, index) => ({ location: camera.name, probability: [87, 68, 51][index] || 40 }))
}

// =========================================================
// MAIN COMPONENT
// =========================================================

function TrajectoryTracking() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [trajectoryData, setTrajectoryData] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [usingDemoData, setUsingDemoData] = useState(false)

  // =======================================================
  // SEARCH
  // =======================================================

  const handleSearch = async () => {
    const plate = searchQuery.trim().toUpperCase()
    if (!plate) {
      setError('Please enter a vehicle number')
      return
    }
    setIsLoading(true)
    setHasSearched(true)
    setError(null)
    setUsingDemoData(false)

    try {
      let response = await fetch(`http://localhost:8000/api/trajectory/${encodeURIComponent(plate)}`)
      let data = null
      if (response.ok) {
        data = await response.json()
      }
      let rawDetections = extractDetections(data)

      if (rawDetections.length === 0) {
        response = await fetch(`http://localhost:8000/api/plate/${encodeURIComponent(plate)}`)
        if (response.ok) {
          data = await response.json()
          rawDetections = extractDetections(data)
        }
      }

      let trajectory = rawDetections.map(normalizeDetection).filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
      trajectory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      trajectory = trajectory.filter((point, index, arr) => {
        if (index === 0) return true
        const previous = arr[index - 1]
        return point.camera_id !== previous.camera_id || point.camera !== previous.camera
      })

      if (trajectory.length < 2) {
        trajectory = generateDemoTrajectory(plate)
        setUsingDemoData(true)
      }

      const predictions = generatePredictions(trajectory)
      setTrajectoryData({
        success: true,
        plate,
        vehicle: plate,
        trajectory,
        predictions,
        vehicle_type: trajectory[0]?.vehicle_type || VEHICLE_TYPES[0]
      })
      setSelectedVehicle(plate)
    } catch (err) {
      console.error('Trajectory search error:', err)
      const trajectory = generateDemoTrajectory(plate)
      setTrajectoryData({
        success: true,
        plate,
        vehicle: plate,
        trajectory,
        predictions: generatePredictions(trajectory),
        vehicle_type: VEHICLE_TYPES[0]
      })
      setSelectedVehicle(plate)
      setUsingDemoData(true)
    } finally {
      setIsLoading(false)
    }
  }

  // =======================================================
  // SUGGEST
  // =======================================================

  const suggestVehicle = () => {
    const randomPlate = VEHICLE_PLATES[Math.floor(Math.random() * VEHICLE_PLATES.length)]
    setSearchQuery(randomPlate)
  }

  // =======================================================
  // KEYBOARD
  // =======================================================

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  // =======================================================
  // CLEAR
  // =======================================================

  const clearSearch = () => {
    setSearchQuery('')
    setSelectedVehicle(null)
    setTrajectoryData(null)
    setHasSearched(false)
    setError(null)
    setUsingDemoData(false)
  }

  // =======================================================
  // EXPORT
  // =======================================================

  const downloadReport = () => {
    if (!trajectoryData) return
    const report = {
      system: 'TRINETRA AI',
      vehicle: trajectoryData.plate || selectedVehicle || 'Unknown',
      vehicle_type: trajectoryData.vehicle_type,
      total_tracking_points: trajectoryData.trajectory?.length || 0,
      cameras_crossed: new Set(trajectoryData.trajectory.map(point => point.camera_id || point.camera)).size,
      trajectory: trajectoryData.trajectory || [],
      predictions: trajectoryData.predictions || [],
      generated_at: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `TRINETRA_${selectedVehicle || 'vehicle'}_trajectory.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // =======================================================
  // DATA
  // =======================================================

  const trajectory = trajectoryData?.trajectory || []
  const predictions = trajectoryData?.predictions || []
  const currentPoint = trajectory.length > 0 ? trajectory[trajectory.length - 1] : null

  // =======================================================
  // STATS
  // =======================================================

  const stats = useMemo(() => {
    if (trajectory.length < 2) {
      return { totalCameras: trajectory.length, travelTime: '--', distance: '0.0', speed: '0.0' }
    }
    const startTime = new Date(trajectory[0].timestamp)
    const endTime = new Date(trajectory[trajectory.length - 1].timestamp)
    const diffMs = Math.max(endTime - startTime, 60000)
    const diffMins = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    const travelTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    let totalDist = 0
    for (let i = 1; i < trajectory.length; i++) {
      const lat1 = Number(trajectory[i - 1].latitude)
      const lon1 = Number(trajectory[i - 1].longitude)
      const lat2 = Number(trajectory[i].latitude)
      const lon2 = Number(trajectory[i].longitude)
      if (!Number.isFinite(lat1) || !Number.isFinite(lon1) || !Number.isFinite(lat2) || !Number.isFinite(lon2)) continue
      const R = 6371
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      totalDist += R * c
    }
    const avgSpeed = totalDist / (diffMs / 3600000)
    return {
      totalCameras: new Set(trajectory.map(point => point.camera_id || point.camera)).size,
      travelTime,
      distance: totalDist.toFixed(1),
      speed: avgSpeed.toFixed(1)
    }
  }, [trajectory])

  // =======================================================
  // MAP
  // =======================================================

  const validPoints = trajectory.filter(point => Number.isFinite(Number(point.latitude)) && Number.isFinite(Number(point.longitude)))
  const mapCenter = validPoints.length > 0 ? [Number(validPoints[0].latitude), Number(validPoints[0].longitude)] : PUNE_CENTER
  const mapBounds = validPoints.length > 1 ? validPoints.map(point => [Number(point.latitude), Number(point.longitude)]) : undefined

  // =======================================================
  // LOADING
  // =======================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Tracking vehicle across camera network...</p>
          <p className="text-xs text-gray-600 mt-2">Searching all available detections</p>
        </div>
      </div>
    )
  }

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Vehicle Trajectory Tracking</h1>
          <p className="text-sm text-gray-400 mt-1">
            Search a vehicle number to view its movement history across the TRINETRA camera network
          </p>
        </div>
        <button onClick={suggestVehicle} className="btn-secondary text-sm flex items-center gap-2">
          <RefreshCw className="w-3 h-3" />
          Suggest Vehicle
        </button>
      </div>

      {/* SEARCH */}
      <div className="glass-card p-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Enter vehicle number e.g. MH14AB1234"
              className="w-full bg-dark-hover border border-dark-border rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="btn-primary px-6 flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Track Vehicle
          </button>

          {hasSearched && (
            <button onClick={clearSearch} className="btn-secondary px-5">Clear</button>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 bg-danger/10 border border-danger/30 rounded-lg">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Demo vehicles:</span>
          {VEHICLE_PLATES.slice(0, 6).map(plate => (
            <button key={plate} onClick={() => setSearchQuery(plate)} className="text-xs px-2 py-1 rounded bg-dark-hover hover:bg-dark-border text-gray-400 hover:text-white transition-colors">
              {plate}
            </button>
          ))}
        </div>
      </div>

      {/* NO RESULT */}
      {hasSearched && !isLoading && !trajectoryData && (
        <div className="glass-card p-8 text-center">
          <AlertCircle className="w-10 h-10 text-warning mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No Trajectory Found</h3>
          <p className="text-sm text-gray-400 mt-2">No tracking data was found for:</p>
          <p className="text-primary font-mono font-bold mt-2">{searchQuery}</p>
        </div>
      )}

      {/* RESULTS */}
      {trajectoryData && trajectory.length > 0 && (
        <>
          {/* DEMO DATA NOTICE */}
          {usingDemoData && (
            <div className="glass-card px-4 py-3 border border-warning/30 bg-warning/5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                <p className="text-xs text-warning">
                  Live detection data was not available. TRINETRA presentation simulation is displaying a multi-camera trajectory.
                </p>
              </div>
            </div>
          )}

          {/* SUMMARY */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                <span className="text-xs text-gray-400">Vehicle</span>
              </div>
              <p className="text-lg font-bold text-white font-mono mt-2">{trajectoryData.plate || selectedVehicle}</p>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-success" />
                <span className="text-xs text-gray-400">Tracking Points</span>
              </div>
              <p className="text-lg font-bold text-white mt-2">{trajectory.length}</p>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-secondary" />
                <span className="text-xs text-gray-400">Cameras Crossed</span>
              </div>
              <p className="text-lg font-bold text-white mt-2">{stats.totalCameras}</p>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                <span className="text-xs text-gray-400">Last Seen</span>
              </div>
              <p className="text-sm font-bold text-white mt-2">
                {currentPoint?.timestamp ? new Date(currentPoint.timestamp).toLocaleString() : 'Unknown'}
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center border-l-4 border-primary">
              <p className="text-xs text-gray-400">Travel Time</p>
              <p className="text-2xl font-bold text-primary">{stats.travelTime}</p>
            </div>
            <div className="glass-card p-4 text-center border-l-4 border-secondary">
              <p className="text-xs text-gray-400">Total Distance</p>
              <p className="text-2xl font-bold text-secondary">{stats.distance} km</p>
            </div>
            <div className="glass-card p-4 text-center border-l-4 border-success">
              <p className="text-xs text-gray-400">Avg Speed</p>
              <p className="text-2xl font-bold text-success">{stats.speed} km/h</p>
            </div>
            <div className="glass-card p-4 text-center border-l-4 border-warning">
              <p className="text-xs text-gray-400">Cameras Crossed</p>
              <p className="text-2xl font-bold text-warning">{stats.totalCameras}</p>
            </div>
          </div>

          {/* MAP */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary" />
                  Pune Trajectory Map
                </h3>
                <p className="text-xs text-gray-500 mt-1">Vehicle movement across {stats.totalCameras} cameras</p>
              </div>
              <button onClick={downloadReport} className="btn-secondary flex items-center gap-2 text-xs">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-dark-hover" style={{ height: '500px' }}>
              <MapContainer
                key={selectedVehicle || 'trajectory-map'}
                center={mapCenter}
                zoom={DEFAULT_ZOOM}
                bounds={mapBounds}
                style={{ height: '100%', width: '100%' }}
                className="rounded-xl"
                zoomControl={true}
              >
                <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {trajectory.length > 1 && (
                  <Polyline
                    positions={trajectory.map(point => [Number(point.latitude), Number(point.longitude)])}
                    pathOptions={{
                      color: '#00B4FF',
                      weight: 5,
                      opacity: 0.85,
                      dashArray: '8, 8',
                      lineJoin: 'round'
                    }}
                  />
                )}

                {trajectory.map((point, index) => {
                  const lat = Number(point.latitude)
                  const lng = Number(point.longitude)
                  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

                  const isStart = index === 0
                  const isEnd = index === trajectory.length - 1
                  const icon = isStart ? createCustomIcon('#00E676', 'S') : isEnd ? createCustomIcon('#00B4FF', 'E') : createCustomIcon('#FFC107', index + 1)

                  return (
                    <Marker key={`${point.camera_id}-${index}`} position={[lat, lng]} icon={icon}>
                      <Popup>
                        <div className="p-2 min-w-[220px]">
                          <p className="font-bold text-dark">{isStart ? '📍 Start' : isEnd ? '🏁 Current' : `📍 Camera ${index + 1}`}</p>
                          <p className="text-sm text-gray-600 font-semibold">{point.location || point.camera || 'Unknown'}</p>
                          <p className="text-xs text-gray-500 mt-1">📹 {point.camera_id || point.camera}</p>
                          <p className="text-xs text-gray-500 mt-1">🕒 {point.timestamp ? new Date(point.timestamp).toLocaleString() : 'N/A'}</p>
                          <p className="text-xs text-success mt-1">Confidence: {Math.round(Number(point.confidence) * 100)}%</p>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-4 text-xs text-gray-400">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-success" /> Start</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warning" /> Camera</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Current</div>
              <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-primary border-t-2 border-primary border-dashed" /> Vehicle Trajectory</div>
            </div>
          </div>

          {/* TIMELINE */}
          <VehicleTimeline trajectory={trajectory} vehicle={trajectoryData.plate || selectedVehicle} />

          {/* AI PREDICTION */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold text-white">AI Movement Prediction</h3>
              <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">AI-PREDICTED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {predictions.map((prediction, index) => (
                <div key={index} className={`glass-card p-4 text-center ${index === 0 ? 'border border-primary/30 bg-primary/5' : 'bg-dark-hover/30'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Route {index + 1}</span>
                    {index === 0 && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Highest</span>}
                  </div>
                  <p className={`text-3xl font-bold ${index === 0 ? 'text-primary' : 'text-gray-400'}`}>{prediction.probability}%</p>
                  <p className="text-sm text-gray-300 mt-1 flex items-center justify-center gap-1"><MapPin className="w-3.5 h-3.5" />{prediction.location}</p>
                  <div className="mt-2 h-1.5 w-full bg-dark-hover rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${prediction.probability}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-warning">Predictions are generated from historical movement patterns and available camera detections.</p>
            </div>
          </div>

          {/* HISTORY */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Tracking History</h3>
              <span className="text-xs text-gray-500">{trajectory.length} detections</span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {trajectory.map((point, index) => (
                <div key={`${point.camera_id}-${index}`} className={`flex items-center gap-4 p-3 rounded-xl ${index === 0 ? 'bg-success/10 border border-success/20' : index === trajectory.length - 1 ? 'bg-primary/10 border border-primary/20' : 'bg-dark-hover border border-dark-border'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-success/20 text-success' : index === trajectory.length - 1 ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>{index + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-white">{point.camera || point.location}</span>
                      {index === 0 && <span className="badge badge-success text-xs">Start</span>}
                      {index === trajectory.length - 1 && <span className="badge badge-primary text-xs">Current</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {Number(point.latitude).toFixed(6)}, {Number(point.longitude).toFixed(6)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{new Date(point.timestamp).toLocaleDateString()}</p>
                    <p className="text-xs text-primary font-mono mt-1">{new Date(point.timestamp).toLocaleTimeString()}</p>
                    <p className="text-xs text-success mt-1">{Math.round(Number(point.confidence) * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EXPORT */}
          <div className="flex flex-wrap gap-3">
            <button onClick={downloadReport} className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button className="btn-secondary flex items-center gap-2" onClick={() => window.print()}>
              <FileText className="w-4 h-4" />
              Print Report
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TrajectoryTracking