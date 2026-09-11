import React, { useState, useEffect } from 'react'
import {
  Maximize2,
  Camera,
  MapPin,
  Activity,
  RefreshCw,
  X,
  Wifi,
  Signal,
  Clock,
  Search,
  FileText,
  AlertCircle
} from 'lucide-react'

import CameraCard from '../components/CameraCard'
import apiService from '../services/api'

const API_BASE = 'http://localhost:8000'

function LiveMonitoring() {
  const [cameras, setCameras] = useState([])
  const [layout, setLayout] = useState('2x2')
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [loading, setLoading] = useState(true)
  const [detectionResults, setDetectionResults] = useState({})
  const [detecting, setDetecting] = useState({})
  const [detectionError, setDetectionError] = useState({})

  // =====================================================
  // CLOCK
  // =====================================================

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // =====================================================
  // LOAD CAMERAS
  // =====================================================

  useEffect(() => {
    fetchCameras()
  }, [])

  const fetchCameras = async () => {
    setLoading(true)
    try {
      const response = await apiService.getCameras()
      const cameraData = response?.cameras || []

      if (cameraData.length > 0) {
        const mappedCameras = cameraData.map(cam => ({
          id: cam.id,
          name: cam.name || cam.id,
          location: cam.location || 'Camera',
          status: cam.status || 'online',
          trafficLevel: 'Low',
          vehicleCount: 0,
          feed: `${API_BASE}/api/camera/${cam.id}/frame`,
          isPhone: cam.type === 'phone'
        }))
        setCameras(mappedCameras)
      } else {
        setCameras([
          {
            id: 'laptop',
            name: 'Laptop Camera',
            location: 'Main System',
            status: 'online',
            trafficLevel: 'Low',
            vehicleCount: 0,
            feed: `${API_BASE}/api/camera/laptop/frame`,
            isPhone: false
          },
          {
            id: 'phone_1',
            name: 'Phone Camera',
            location: 'Remote',
            status: 'online',
            trafficLevel: 'Low',
            vehicleCount: 0,
            feed: `${API_BASE}/api/camera/phone_1/frame`,
            isPhone: true
          }
        ])
      }
    } catch (error) {
      console.error('❌ Error fetching cameras:', error)
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // RUN AI DETECTION WITH TIMEOUT
  // =====================================================

  const runDetection = async (cameraId) => {
    // Clear previous error for this camera
    setDetectionError(prev => ({ ...prev, [cameraId]: null }))
    
    // Set detecting state
    setDetecting(prev => ({
      ...prev,
      [cameraId]: true
    }))

    try {
      console.log(`🔍 Running detection for ${cameraId}`)

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch(`${API_BASE}/api/camera/${cameraId}/detect`, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('🚗 AI Detection Result:', data)

      if (data.success) {
        // SAVE RESULT
        setDetectionResults(prev => ({
          ...prev,
          [cameraId]: {
            vehicles: data.vehicles_detected || 0,
            plates: data.plates_found || [],
            timestamp: data.timestamp || new Date().toISOString()
          }
        }))

        // UPDATE CAMERA VEHICLE COUNT
        setCameras(prev =>
          prev.map(camera => {
            if (camera.id !== cameraId) return camera

            const count = data.vehicles_detected || 0
            let traffic = 'Low'
            if (count >= 10) traffic = 'Heavy'
            else if (count >= 5) traffic = 'Medium'

            return {
              ...camera,
              vehicleCount: count,
              trafficLevel: traffic
            }
          })
        )

        // UPDATE SELECTED CAMERA
        setSelectedCamera(prev => {
          if (prev && prev.id === cameraId) {
            return {
              ...prev,
              vehicleCount: data.vehicles_detected || 0
            }
          }
          return prev
        })

        // Show success message if vehicles detected
        if (data.vehicles_detected === 0) {
          setDetectionError(prev => ({
            ...prev,
            [cameraId]: 'No vehicles detected. Try showing a clear vehicle to the camera.'
          }))
        }
      } else {
        setDetectionError(prev => ({
          ...prev,
          [cameraId]: data.message || 'Detection failed'
        }))
      }
    } catch (error) {
      console.error(`❌ Detection failed for ${cameraId}:`, error)
      
      let errorMessage = 'Detection failed'
      if (error.name === 'AbortError') {
        errorMessage = 'Detection timed out after 30 seconds. Try again.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setDetectionError(prev => ({
        ...prev,
        [cameraId]: errorMessage
      }))
    } finally {
      setDetecting(prev => ({
        ...prev,
        [cameraId]: false
      }))
    }
  }

  // =====================================================
  // GRID
  // =====================================================

  const getGridCols = () => {
    if (layout === '2x2') return 'grid-cols-1 md:grid-cols-2'
    if (layout === '3x3') return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
    if (layout === '4x4') return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
    return 'grid-cols-1 md:grid-cols-2'
  }

  // =====================================================
  // DISPLAY CAMERAS
  // =====================================================

  const getDisplayCameras = () => {
    let count = 4
    if (layout === '3x3') count = 9
    if (layout === '4x4') count = 16

    const online = cameras.filter(camera => camera.status === 'online')
    const offline = cameras.filter(camera => camera.status !== 'online')

    return [...online, ...offline].slice(0, count)
  }

  // =====================================================
  // CAMERA CLICK
  // =====================================================

  const handleCameraClick = (camera) => {
    setSelectedCamera(camera)
    setIsModalOpen(true)
  }

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchCameras()
    setIsRefreshing(false)
  }

  const displayCameras = getDisplayCameras()
  const onlineCount = cameras.filter(camera => camera.status === 'online').length
  const totalCount = cameras.length

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading cameras...</p>
        </div>
      </div>
    )
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Monitoring</h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time surveillance feeds from all connected cameras
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* LIVE STATUS */}
          <div className="flex items-center gap-4 px-3 py-2 glass-card text-sm">
            <div className="flex items-center gap-1.5">
              <span className="status-dot online" />
              <span className="text-gray-400">Live</span>
              <span className="text-white font-mono">{currentTime}</span>
            </div>
            <div className="h-4 w-px bg-dark-border" />
            <div className="flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-success" />
              <span className="text-gray-400">{onlineCount}/{totalCount}</span>
              <span className="text-gray-500 text-xs">online</span>
            </div>
          </div>

          {/* LAYOUT */}
          <div className="flex items-center gap-1 glass-card p-1">
            {['2x2', '3x3', '4x4'].map(option => (
              <button
                key={option}
                onClick={() => setLayout(option)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  layout === option
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* REFRESH */}
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* CAMERA SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-3">
          <p className="text-xs text-gray-400">Total Cameras</p>
          <p className="text-lg font-bold text-white">{totalCount}</p>
        </div>
        <div className="glass-card p-3 border-l-2 border-success">
          <p className="text-xs text-gray-400">Online</p>
          <p className="text-lg font-bold text-success">{onlineCount}</p>
        </div>
        <div className="glass-card p-3 border-l-2 border-danger">
          <p className="text-xs text-gray-400">Offline</p>
          <p className="text-lg font-bold text-danger">{totalCount - onlineCount}</p>
        </div>
        <div className="glass-card p-3 border-l-2 border-secondary">
          <p className="text-xs text-gray-400">AI Active</p>
          <p className="text-lg font-bold text-secondary">{onlineCount}</p>
        </div>
      </div>

      {/* CAMERA GRID */}
      {displayCameras.length > 0 ? (
        <div className={`grid ${getGridCols()} gap-4`}>
          {displayCameras.map(camera => {
            const result = detectionResults[camera.id]
            const error = detectionError[camera.id]
            const isDetecting = detecting[camera.id]

            return (
              <div key={camera.id} className="relative">
                {/* CAMERA CARD */}
                <div onClick={() => handleCameraClick(camera)}>
                  <CameraCard camera={camera} />
                </div>

                {/* DETECT BUTTON */}
                <div className="absolute bottom-16 left-3 right-3 flex items-center justify-between z-20">
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      runDetection(camera.id)
                    }}
                    className={`text-xs py-1 px-3 flex items-center gap-1 rounded-lg transition-all ${
                      isDetecting
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                    disabled={isDetecting}
                  >
                    {isDetecting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Search className="w-3 h-3" />
                        Detect
                      </>
                    )}
                  </button>

                  {/* RESULT COUNT */}
                  {result && !isDetecting && (
                    <div className="bg-black/80 rounded-lg px-3 py-1 text-xs">
                      <span className="text-success">🚗 {result.vehicles}</span>
                      <span className="text-primary ml-3">📋 {result.plates.length}</span>
                    </div>
                  )}
                </div>

                {/* ERROR MESSAGE */}
                {error && !isDetecting && (
                  <div className="mt-1 glass-card p-2 border border-danger/30">
                    <div className="flex items-center gap-2 text-xs text-danger">
                      <AlertCircle className="w-3 h-3" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* PLATE RESULTS */}
                {result && result.plates.length > 0 && !isDetecting && (
                  <div className="mt-2 glass-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-white">Detected Plates</span>
                    </div>
                    <div className="space-y-2">
                      {result.plates.slice(0, 3).map((plate, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2"
                        >
                          <div>
                            <p className="text-white font-mono font-bold">{plate.plate}</p>
                            <p className="text-xs text-gray-500">{plate.vehicle?.class || 'Vehicle'}</p>
                          </div>
                          <span className="text-xs text-success">{(plate.confidence * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                      {result.plates.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{result.plates.length - 3} more plates
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Camera className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white">No Cameras Found</h3>
          <p className="text-gray-400 mt-2">Start your backend server to see camera feeds</p>
          <button onClick={fetchCameras} className="btn-primary mt-4">Retry Connection</button>
        </div>
      )}

      {/* CAMERA MODAL */}
      {isModalOpen && selectedCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedCamera.name}</h2>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedCamera.location}
                    <span>|</span>
                    <span className="font-mono">{selectedCamera.id}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-dark-hover rounded-lg"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* VIDEO */}
              <div className="aspect-video bg-dark-hover rounded-xl overflow-hidden mb-6">
                <img
                  src={`${API_BASE}/api/camera/${selectedCamera.id}/frame?t=${Date.now()}`}
                  alt={selectedCamera.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = ''
                    e.target.alt = 'No feed available'
                  }}
                />
              </div>

              {/* CAMERA INFORMATION */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="glass-card p-4">
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-base font-semibold text-success mt-1">Online</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-gray-400">Traffic Level</p>
                  <p className="text-base font-semibold text-white mt-1">
                    {selectedCamera.trafficLevel || 'Low'}
                  </p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-gray-400">Vehicles Detected</p>
                  <p className="text-base font-semibold text-success mt-1">
                    {selectedCamera.vehicleCount || 0}
                  </p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-gray-400">AI Status</p>
                  <p className="text-base font-semibold text-secondary flex items-center gap-2 mt-1">
                    <Activity className="w-4 h-4" />
                    Active
                  </p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-gray-400">Signal Strength</p>
                  <p className="text-base font-semibold text-success flex items-center gap-2 mt-1">
                    <Signal className="w-4 h-4" />
                    Strong
                  </p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-gray-400">Last Active</p>
                  <p className="text-base font-semibold text-white flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {currentTime}
                  </p>
                </div>
              </div>

              {/* PLATES IN MODAL */}
              {detectionResults[selectedCamera.id] &&
                detectionResults[selectedCamera.id].plates.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-white">Number Plates Detected</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {detectionResults[selectedCamera.id].plates.map((plate, index) => (
                        <div key={index} className="glass-card p-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">{plate.vehicle?.class || 'Vehicle'}</p>
                            <p className="text-lg font-mono font-bold text-white">{plate.plate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">OCR Confidence</p>
                            <p className="text-success font-bold">{(plate.confidence * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 border-t border-dark-border flex justify-end gap-3">
              <button
                onClick={() => runDetection(selectedCamera.id)}
                className="btn-primary flex items-center gap-2"
                disabled={detecting[selectedCamera.id]}
              >
                <Search className="w-4 h-4" />
                {detecting[selectedCamera.id] ? 'Detecting...' : 'Run AI Detection'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveMonitoring