import React, { useState } from 'react'
import {
  Search,
  Camera,
  Clock,
  AlertCircle,
  Download,
  MapPin,
  Route,
  RefreshCw
} from 'lucide-react'

// =========================================================
// SAME DATA AS TRAJECTORY TRACKING
// =========================================================

const VEHICLE_PLATES = [
  'MH14AB1234', 'MH12XY5678', 'MH14CD9999', 'MH15EF3456',
  'MH14GH7890', 'MH12JK2345', 'MH14LM6789', 'MH12NO3456',
  'MH14PQ7890', 'MH15RS2345', 'MH14TU6789', 'MH12VW3456'
]

const VEHICLE_TYPES = ['Car', 'SUV', 'Sedan', 'Hatchback', 'Truck', 'Bus', 'Motorcycle']

// Same camera locations as Trajectory Tracking
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

// =========================================================
// GENERATE MOCK DETECTIONS (Same as Trajectory Tracking)
// =========================================================

const generateMockDetections = (plate) => {
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
    timestamp: new Date(now + index * 12 * 60000).toISOString(),
    confidence: Number((0.91 + ((hash + index) % 8) / 100).toFixed(2)),
    vehicle_type: VEHICLE_TYPES[hash % VEHICLE_TYPES.length],
    source: 'TRINETRA AI DEMO DATA'
  }))
}

// =========================================================
// EXTRACT DATA FROM BACKEND
// =========================================================

const extractDetections = data => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.detections)) return data.detections
  if (Array.isArray(data.trajectory)) return data.trajectory
  if (Array.isArray(data.results)) return data.results
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.data?.detections)) return data.data.detections
  if (Array.isArray(data.data?.trajectory)) return data.data.trajectory
  return []
}

// =========================================================
// NORMALIZE DETECTION
// =========================================================

const normalizeDetection = (item, index) => {
  return {
    ...item,
    plate: item.plate || item.plate_number || item.number_plate || item.vehicle_number || '',
    camera: item.camera || item.camera_name || item.cameraName || item.location_name || item.location?.name || item.location || `Camera ${index + 1}`,
    camera_id: item.camera_id || item.cameraId || `CAM-${String(index + 1).padStart(3, '0')}`,
    location: item.location?.name || item.location_name || (typeof item.location === 'string' ? item.location : item.camera_name || item.camera || `Camera ${index + 1}`),
    latitude: Number(item.latitude) || Number(item.lat) || Number(item.location?.latitude) || Number(item.location?.lat),
    longitude: Number(item.longitude) || Number(item.lng) || Number(item.lon) || Number(item.location?.longitude) || Number(item.location?.lng),
    timestamp: item.timestamp || item.detected_at || item.detection_time || item.time || new Date(Date.now() - index * 10 * 60000).toISOString(),
    confidence: Number(item.confidence) || Number(item.score) || Number(item.plate_confidence) || 0.90
  }
}

// =========================================================
// MAIN COMPONENT
// =========================================================

function VehicleSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState(null)
  const [usingMockData, setUsingMockData] = useState(false)

  // =======================================================
  // SEARCH
  // =======================================================

  const handleSearch = async () => {
    const plate = searchQuery.trim().toUpperCase()
    if (!plate) return

    setLoading(true)
    setHasSearched(true)
    setError(null)
    setUsingMockData(false)

    try {
      // First: Search plate endpoint
      let response = await fetch(`http://localhost:8000/api/plate/${encodeURIComponent(plate)}`)
      let data = null
      let rawResults = []

      if (response.ok) {
        data = await response.json()
        rawResults = extractDetections(data)
      }

      // Second: If plate endpoint returns nothing, search trajectory endpoint
      if (rawResults.length === 0) {
        response = await fetch(`http://localhost:8000/api/trajectory/${encodeURIComponent(plate)}`)
        if (response.ok) {
          data = await response.json()
          rawResults = extractDetections(data)
        }
      }

      // Normalize results
      let results = rawResults
        .map(normalizeDetection)
        .filter(item => {
          if (!item.plate) return true
          return item.plate.replace(/[^A-Z0-9]/g, '').toUpperCase().includes(plate.replace(/[^A-Z0-9]/g, ''))
        })

      // Sort oldest -> newest
      results.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

      // Remove exact duplicate detections
      const seen = new Set()
      results = results.filter(item => {
        const key = [item.camera_id, item.timestamp, item.plate].join('|')
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })

      // If no results from backend, use mock data (same as TrajectoryTracking)
      if (results.length === 0) {
        const mockData = generateMockDetections(plate)
        results = mockData.map((item, index) => normalizeDetection(item, index))
        setUsingMockData(true)
      }

      setSearchResults(results)
    } catch (err) {
      console.error('Vehicle search error:', err)
      // Use mock data on error (same as TrajectoryTracking)
      const mockData = generateMockDetections(plate)
      const results = mockData.map((item, index) => normalizeDetection(item, index))
      setSearchResults(results)
      setUsingMockData(true)
      setError('Using demo data - Backend not available')
    } finally {
      setLoading(false)
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
  // KEY
  // =======================================================

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // =======================================================
  // CLEAR
  // =======================================================

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setHasSearched(false)
    setError(null)
    setUsingMockData(false)
  }

  // =======================================================
  // EXPORT
  // =======================================================

  const exportResults = () => {
    if (!searchResults.length) return

    const report = {
      system: 'TRINETRA AI',
      vehicle: searchQuery,
      total_detections: searchResults.length,
      cameras: [...new Set(searchResults.map(item => item.camera_id || item.camera))],
      detections: searchResults,
      generated_at: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `TRINETRA_${searchQuery}_detections.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // =======================================================
  // CAMERA COUNT
  // =======================================================

  const cameraCount = new Set(searchResults.map(item => item.camera_id || item.camera)).size

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Vehicle Search</h1>
          <p className="text-sm text-gray-400 mt-1">
            Search vehicles across the complete TRINETRA AI camera network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={suggestVehicle} className="btn-secondary text-sm flex items-center gap-2">
            <RefreshCw className="w-3 h-3" />
            Suggest Vehicle
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Route className="w-4 h-4" />
            Cross-Camera Intelligence
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value.toUpperCase())}
              onKeyDown={handleKeyPress}
              placeholder="Enter vehicle number plate (e.g. MH14AB1234)"
              className="input-field pl-12"
              disabled={loading}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                ✕
              </button>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="btn-primary flex items-center gap-2 px-8"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Searching Network...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Vehicle
              </>
            )}
          </button>
        </div>

        {/* DEMO PLATES */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Try:</span>
          {VEHICLE_PLATES.slice(0, 8).map(plate => (
            <button
              key={plate}
              onClick={() => setSearchQuery(plate)}
              className="text-xs px-2 py-1 rounded bg-dark-hover hover:bg-dark-border text-gray-400 hover:text-white transition-colors"
            >
              {plate}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              <p className="text-sm text-warning">{error}</p>
            </div>
          </div>
        )}

        {usingMockData && searchResults.length > 0 && (
          <div className="mt-3 p-2 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-xs text-primary flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              Showing demo data (TRINETRA AI simulation)
            </p>
          </div>
        )}
      </div>

      {/* RESULTS */}
      {hasSearched && !loading && (
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            <>
              {/* SUMMARY */}
              <div className="glass-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Found <span className="text-primary font-bold">{searchResults.length}</span> detections across{' '}
                      <span className="text-primary font-bold">{cameraCount}</span> cameras for{' '}
                      <span className="text-white font-mono ml-1">{searchQuery}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Detection history synchronized with trajectory tracking</p>
                  </div>
                  <button onClick={exportResults} className="btn-secondary flex items-center gap-2 text-sm">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {/* CAMERA PATH SUMMARY */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Route className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-white">Detected Camera Path</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {searchResults.map((detection, index) => (
                    <React.Fragment key={`${detection.camera_id}-${index}`}>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-hover border border-dark-border">
                        <Camera className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-white">{detection.camera || detection.location}</span>
                      </div>
                      {index < searchResults.length - 1 && <span className="text-gray-600">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* DETECTION CARDS */}
              {searchResults.map((detection, index) => (
                <div key={`${detection.camera_id}-${detection.timestamp}-${index}`} className="glass-card p-4 hover:border-primary/30 transition-colors border-l-4 border-primary">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{index + 1}</span>
                        <p className="text-xl font-bold text-primary font-mono">{detection.plate || searchQuery}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" />{detection.camera || detection.location || 'Unknown Camera'}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{detection.camera_id || 'Camera ID N/A'}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{detection.timestamp ? new Date(detection.timestamp).toLocaleString() : 'N/A'}</span>
                      </div>
                      {Number.isFinite(detection.latitude) && Number.isFinite(detection.longitude) && (
                        <p className="text-xs text-gray-500 mt-2">📍 {detection.latitude.toFixed(6)}, {detection.longitude.toFixed(6)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {detection.confidence > 0.7 ? (
                        <span className="badge badge-success">High Confidence</span>
                      ) : detection.confidence > 0.4 ? (
                        <span className="badge badge-warning">Medium Confidence</span>
                      ) : (
                        <span className="badge badge-gray">Low Confidence</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-dark-border flex items-center justify-between">
                    <span className="text-xs text-gray-500">Detection #{index + 1}</span>
                    <span className="text-xs text-success font-medium">{Math.round(Number(detection.confidence) * 100)}% plate confidence</span>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="glass-card p-12 text-center">
              <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white">No Results Found</h3>
              <p className="text-gray-400 mt-2">No detections found for <span className="text-primary font-mono">{searchQuery}</span></p>
              <p className="text-sm text-gray-500 mt-2">
                {usingMockData ? 'Try searching for a different vehicle' : 'Run ANPR detection on your camera network first.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VehicleSearch