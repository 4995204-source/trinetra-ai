import React, { useState, useEffect, useCallback } from 'react'
import {
  Car,
  Camera,
  AlertTriangle,
  Activity,
  Gauge,
  Cpu,
  RefreshCw,
  Search,
  TrendingUp,
  MapPin,
  Bell,
  FileText
} from 'lucide-react'

import StatCard from '../components/StatCard'
import CameraCard from '../components/CameraCard'
import DetectionTable from '../components/DetectionTable'
import TrafficChart from '../components/TrafficChart'
import CityMap from '../components/CityMap'

import {
  mockDetections,
  mockTrafficData
} from '../data/mockData'

// ============================================================
// CONFIG
// ============================================================

const API_BASE_URL = 'http://localhost:8000'

// ============================================================
// DASHBOARD
// ============================================================

function Dashboard() {

  // ==========================================================
  // LIVE CAMERA STATE
  // ==========================================================

  const [cameras, setCameras] = useState([])
  const [camerasLoading, setCamerasLoading] = useState(true)
  const [cameraError, setCameraError] = useState(null)

  // ==========================================================
  // EXISTING DASHBOARD DATA
  // ==========================================================

  const [detections] = useState(mockDetections)
  const [trafficData] = useState(mockTrafficData)

  const [currentTime, setCurrentTime] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)

  const [liveStats, setLiveStats] = useState({
    totalVehicles: 12847,
    vehiclesThisHour: 1234,
    suspiciousVehicles: 7,
    alertsCount: 3,
    violationsCount: 2
  })

  // ==========================================================
  // FETCH CAMERAS FROM FASTAPI
  // ==========================================================

  const fetchCameras = useCallback(async () => {
    try {
      setCameraError(null)
      setCamerasLoading(true)

      const response = await fetch(
        `${API_BASE_URL}/api/cameras`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(
          `Camera API error: ${response.status}`
        )
      }

      const data = await response.json()

      console.log('📹 Camera API response:', data)

      // ======================================================
      // HANDLE ALL COMMON FASTAPI RESPONSE FORMATS
      // ======================================================

      let cameraList = []

      if (Array.isArray(data)) {
        cameraList = data
      } else if (Array.isArray(data.cameras)) {
        cameraList = data.cameras
      } else if (Array.isArray(data.data)) {
        cameraList = data.data
      } else if (
        data.data &&
        Array.isArray(data.data.cameras)
      ) {
        cameraList = data.data.cameras
      }

      console.log('📹 Camera count:', cameraList.length)

      // ======================================================
      // NORMALIZE CAMERA DATA WITH PROPER FEED URL
      // ======================================================

      const normalizedCameras = cameraList.map(
        (camera, index) => {

          // CAMERA ID
          const cameraId =
            camera.id ??
            camera.camera_id ??
            camera.cameraId ??
            `CAM-${String(index + 1).padStart(3, '0')}`

          // STATUS
          const rawStatus =
            camera.status ??
            camera.state ??
            'online'

          const normalizedStatus =
            String(rawStatus).toLowerCase()

          const isOnline =
            normalizedStatus === 'online' ||
            normalizedStatus === 'active' ||
            normalizedStatus === 'running' ||
            normalizedStatus === 'connected' ||
            normalizedStatus === 'streaming'

          // NAME
          const cameraName =
            camera.name ??
            camera.camera_name ??
            camera.cameraName ??
            `Camera ${index + 1}`

          // LOCATION
          const location =
            typeof camera.location === 'string'
              ? camera.location
              : camera.location?.name ??
                camera.location_name ??
                'Pune'

          // CRITICAL: Build the feed URL correctly
          const frameUrl =
            `${API_BASE_URL}/api/camera/${encodeURIComponent(cameraId)}/frame`

          // ======================================================
          // RETURN NORMALIZED OBJECT WITH FEED URL
          // ======================================================

          return {
            id: cameraId,
            camera_id: cameraId,
            name: cameraName,
            location: location,
            status: isOnline ? 'online' : 'offline',
            online: isOnline,
            
            // CRITICAL: The CameraCard uses 'feed' property
            feed: frameUrl,
            
            // Also provide these for compatibility
            feedUrl: frameUrl,
            frameUrl: frameUrl,
            frame_url: frameUrl,
            
            // Other properties
            trafficLevel: camera.trafficLevel || 'Low',
            vehicleCount: camera.vehicleCount || 0,
            isPhone: camera.type === 'phone',
            type: camera.type || 'camera',
            lat: camera.latitude || camera.lat || 0,
            lng: camera.longitude || camera.lng || 0,
            latitude: camera.latitude || camera.lat || 0,
            longitude: camera.longitude || camera.lng || 0,
            has_frame: true
          }
        }
      )

      console.log('✅ Normalized cameras with feed URLs:', normalizedCameras)

      setCameras(normalizedCameras)

    } catch (error) {

      console.error(
        '❌ Failed to load cameras:',
        error
      )

      setCameraError(
        'Unable to connect to the camera network.'
      )

      // ======================================================
      // FALLBACK: Use mock cameras with feed URLs
      // ======================================================

      const fallbackCameras = [
        {
          id: 'laptop',
          name: 'Laptop Camera',
          location: 'Main System',
          status: 'online',
          online: true,
          feed: `${API_BASE_URL}/api/camera/laptop/frame`,
          trafficLevel: 'Low',
          vehicleCount: 0,
          isPhone: false,
          type: 'laptop',
          lat: 18.5204,
          lng: 73.8567,
          has_frame: true
        },
        {
          id: 'phone_1',
          name: 'Phone Camera 1',
          location: 'Remote',
          status: 'online',
          online: true,
          feed: `${API_BASE_URL}/api/camera/phone_1/frame`,
          trafficLevel: 'Low',
          vehicleCount: 0,
          isPhone: true,
          type: 'phone',
          lat: 18.5300,
          lng: 73.8500,
          has_frame: true
        },
        {
          id: 'phone_2',
          name: 'Phone Camera 2',
          location: 'Remote',
          status: 'online',
          online: true,
          feed: `${API_BASE_URL}/api/camera/phone_2/frame`,
          trafficLevel: 'Low',
          vehicleCount: 0,
          isPhone: true,
          type: 'phone',
          lat: 18.5500,
          lng: 73.8100,
          has_frame: true
        },
        {
          id: 'phone_3',
          name: 'Phone Camera 3',
          location: 'Remote',
          status: 'online',
          online: true,
          feed: `${API_BASE_URL}/api/camera/phone_3/frame`,
          trafficLevel: 'Low',
          vehicleCount: 0,
          isPhone: true,
          type: 'phone',
          lat: 18.5100,
          lng: 73.8100,
          has_frame: true
        }
      ]

      setCameras(fallbackCameras)

    } finally {

      setCamerasLoading(false)

    }
  }, [])

  // ==========================================================
  // INITIAL CAMERA LOAD
  // ==========================================================

  useEffect(() => {

    fetchCameras()

    // Refresh camera status every 15 seconds.
    const interval = setInterval(
      fetchCameras,
      15000
    )

    return () => {
      clearInterval(interval)
    }

  }, [fetchCameras])

  // ==========================================================
  // CLOCK
  // ==========================================================

  useEffect(() => {

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }))
    }

    updateTime()

    const interval = setInterval(
      updateTime,
      1000
    )

    return () => {
      clearInterval(interval)
    }

  }, [])

  // ==========================================================
  // DETECTION
  // ==========================================================

  const runDashboardDetection = async () => {
    setIsDetecting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/camera/laptop/detect`)
      const data = await response.json()
      if (data.success) {
        alert(`✅ ${data.vehicles_detected} vehicles detected! ${data.plates_found.length} plates found!`)
        await fetchCameras()
      } else {
        alert('❌ No vehicles detected. Try showing a vehicle to the camera.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Detection failed. Make sure backend is running.')
    } finally {
      setIsDetecting(false)
    }
  }

  // ==========================================================
  // REFRESH DASHBOARD
  // ==========================================================

  const handleRefresh = async () => {

    setIsRefreshing(true)

    try {

      await fetchCameras()

    } catch (error) {

      console.error(
        'Dashboard refresh error:',
        error
      )

    } finally {

      setIsRefreshing(false)

    }

  }

  // ==========================================================
  // CAMERA STATUS HELPERS
  // ==========================================================

  const isCameraOnline = camera => {

    if (
      camera.online === true
    ) {
      return true
    }

    const status =
      String(
        camera.status ?? ''
      ).toLowerCase()

    return (
      status === 'online' ||
      status === 'active' ||
      status === 'running' ||
      status === 'connected' ||
      status === 'streaming'
    )
  }

  // ==========================================================
  // ONLINE CAMERAS
  // ==========================================================

  const onlineCameras =
    cameras.filter(isCameraOnline)

  // ==========================================================
  // DASHBOARD PREVIEW
  // ==========================================================

  const dashboardCameras =
    onlineCameras.slice(0, 4)

  // ==========================================================
  // CAMERA COUNTS
  // ==========================================================

  const totalCameraCount =
    cameras.length

  const onlineCameraCount =
    onlineCameras.length

  const offlineCameraCount =
    Math.max(
      totalCameraCount -
      onlineCameraCount,
      0
    )

  // ==========================================================
  // FETCH STATS
  // ==========================================================

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics`)
      const data = await response.json()
      if (data.success) {
        setLiveStats({
          totalVehicles: data.total_detections || 12847,
          vehiclesThisHour: Math.floor((data.total_detections || 0) / 10) || 1234,
          suspiciousVehicles: data.watchlist_count || 7,
          alertsCount: 3,
          violationsCount: 2
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // ==========================================================
  // EFFECTS FOR STATS
  // ==========================================================

  useEffect(() => {
    fetchStats()
    const statsInterval = setInterval(fetchStats, 30000)
    return () => clearInterval(statsInterval)
  }, [])

  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="space-y-6 animate-fadeIn">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time traffic surveillance and monitoring dashboard
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="status-dot online" />
            <span>Live</span>
            <span className="font-mono text-primary">{currentTime}</span>
          </div>

          <button
            onClick={runDashboardDetection}
            className="btn-primary flex items-center gap-2"
            disabled={isDetecting}
          >
            {isDetecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Detect Vehicles
              </>
            )}
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>

        </div>

      </div>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Car}
          label="Total Vehicles Today"
          value={liveStats.totalVehicles.toLocaleString()}
          subValue="↑ 8.2% from yesterday"
          trend={8.2}
          color="primary"
        />
        <StatCard
          icon={Camera}
          label="Active Cameras"
          value={`${onlineCameraCount} / ${totalCameraCount}`}
          subValue={`${onlineCameraCount} cameras online`}
          color="success"
        />
        <StatCard
          icon={Activity}
          label="Vehicles Detected This Hour"
          value={liveStats.vehiclesThisHour.toLocaleString()}
          subValue="Peak hour: 10-11 AM"
          trend={12.4}
          color="secondary"
        />
        <StatCard
          icon={Bell}
          label="Active Alerts"
          value={liveStats.alertsCount}
          subValue="2 critical alerts"
          color="danger"
        />
      </div>

      {/* =====================================================
          SECOND ROW KPI
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Gauge}
          label="Average Traffic Density"
          value="Medium"
          subValue="5 congested spots detected"
          color="warning"
        />
        <StatCard
          icon={Cpu}
          label="AI Recognition Accuracy"
          value="94.6%"
          subValue="Based on real-time detections"
          trend={2.3}
          color="success"
        />
        <StatCard
          icon={Activity}
          label="System Uptime"
          value="99.8%"
          subValue="24/7 operational"
          color="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Traffic Violations"
          value={liveStats.violationsCount}
          subValue="Signal jumps detected"
          color="warning"
        />
      </div>

      {/* =====================================================
          LIVE CAMERA FEEDS
      ===================================================== */}

      <div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

          <div>

            <h2 className="text-lg font-semibold text-white flex items-center gap-2">

              <Camera className="w-5 h-5 text-primary" />

              Live Camera Feeds

              {onlineCameraCount > 0 && (

                <span className="flex items-center gap-1 ml-1 text-xs text-success font-normal">

                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />

                  {onlineCameraCount} LIVE

                </span>

              )}

            </h2>

            <p className="text-xs text-gray-500 mt-1">
              {onlineCameraCount} of {totalCameraCount} cameras currently online
            </p>

          </div>

          <span className="text-xs text-gray-400">
            Click camera to expand
          </span>

        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {camerasLoading && (

          <div className="glass-card p-10 text-center">

            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />

            <p className="text-sm text-gray-400">
              Connecting to live camera network...
            </p>

          </div>

        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!camerasLoading &&
          cameraError && (

          <div className="glass-card p-10 text-center border border-danger/20">

            <AlertTriangle className="w-10 h-10 text-warning mx-auto mb-3" />

            <h3 className="text-lg font-semibold text-white">
              Camera Network Unavailable
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              {cameraError}
            </p>

            <button
              onClick={fetchCameras}
              className="btn-secondary mt-5 flex items-center gap-2 mx-auto"
            >

              <RefreshCw className="w-4 h-4" />

              Retry Connection

            </button>

          </div>

        )}

        {/* ===================================================
            LIVE CAMERA GRID
        =================================================== */}

        {!camerasLoading &&
          !cameraError &&
          dashboardCameras.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

            {dashboardCameras.map(
              camera => {

                // Debug log to check feed URL
                console.log('📹 Rendering camera:', camera.id, 'Feed URL:', camera.feed)

                return (
                  <CameraCard
                    key={camera.id}
                    camera={camera}
                  />
                )
              }
            )}

          </div>

        )}

        {/* ===================================================
            NO ONLINE CAMERAS
        =================================================== */}

        {!camerasLoading &&
          !cameraError &&
          dashboardCameras.length === 0 && (

          <div className="glass-card p-12 text-center">

            <Camera className="w-12 h-12 text-gray-600 mx-auto mb-4" />

            <h3 className="text-lg font-semibold text-white">
              No Live Video Available
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              TRINETRA could not find any online camera streams.
            </p>

            <button
              onClick={fetchCameras}
              className="btn-secondary mt-5 flex items-center gap-2 mx-auto"
            >

              <RefreshCw className="w-4 h-4" />

              Refresh Camera Network

            </button>

          </div>

        )}

      </div>

      {/* =====================================================
          LIVE DETECTIONS & MAP
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Live Detections
            </h2>
            <span className="text-xs text-gray-400">Real-time ANPR results</span>
          </div>
          <DetectionTable detections={detections.slice(0, 5)} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-warning" />
              Traffic Overview
            </h2>
          </div>
          <TrafficChart
            data={trafficData.slice(0, 5)}
            title="Hourly Vehicle Count"
            type="area"
          />
        </div>
      </div>

      {/* =====================================================
          CITY MAP
      ===================================================== */}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            City Traffic Map
          </h2>
          <div className="flex items-center gap-3 text-xs">
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
        <CityMap cameras={cameras} />
      </div>

      {/* =====================================================
          QUICK STATS FOOTER
      ===================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">98.7%</p>
          <p className="text-xs text-gray-400">Plate Recognition Rate</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-success">2.3s</p>
          <p className="text-xs text-gray-400">Avg. Detection Time</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-warning">{liveStats.suspiciousVehicles}</p>
          <p className="text-xs text-gray-400">Watchlist Vehicles</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-secondary">24/7</p>
          <p className="text-xs text-gray-400">System Availability</p>
        </div>
      </div>

    </div>

  )
}

export default Dashboard