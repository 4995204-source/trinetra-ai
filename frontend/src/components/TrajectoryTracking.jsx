import React, { useState } from 'react'
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
  FileText
} from 'lucide-react'

import TrajectoryMap from '../components/TrajectoryMap'
import VehicleTimeline from '../components/VehicleTimeline'


function TrajectoryTracking() {

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [trajectoryData, setTrajectoryData] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  // =====================================================
  // SEARCH VEHICLE
  // =====================================================

  const handleSearch = async () => {

    const plate = searchQuery.trim()

    if (!plate) {
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {

      const response = await fetch(
        `http://localhost:8000/api/vehicle/${encodeURIComponent(
          plate
        )}/trajectory`
      )

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        )
      }

      const data = await response.json()

      console.log(
        '🚗 Trajectory:',
        data
      )

      if (
        data.success === false ||
        !data.trajectory
      ) {

        setTrajectoryData(null)
        setSelectedVehicle(null)

        return
      }

      setTrajectoryData(data)

      setSelectedVehicle(
        data.plate ||
        plate.toUpperCase()
      )

    } catch (error) {

      console.error(
        '❌ Trajectory error:',
        error
      )

      setTrajectoryData(null)

    } finally {

      setIsLoading(false)

    }
  }


  // =====================================================
  // ENTER
  // =====================================================

  const handleKeyDown = (event) => {

    if (event.key === 'Enter') {
      handleSearch()
    }

  }


  // =====================================================
  // CLEAR
  // =====================================================

  const clearSearch = () => {

    setSearchQuery('')
    setSelectedVehicle(null)
    setTrajectoryData(null)
    setHasSearched(false)

  }


  // =====================================================
  // EXPORT
  // =====================================================

  const downloadReport = () => {

    if (!trajectoryData) {
      return
    }

    const report = {

      vehicle:
        trajectoryData.plate ||
        selectedVehicle ||
        'Unknown',

      trajectory:
        trajectoryData.trajectory || [],

      generated_at:
        new Date().toISOString()

    }

    const blob = new Blob(
      [
        JSON.stringify(
          report,
          null,
          2
        )
      ],
      {
        type: 'application/json'
      }
    )

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = url

    link.download =
      `TRINETRA_${selectedVehicle || 'vehicle'}_trajectory.json`

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)

  }


  const trajectory =
    trajectoryData?.trajectory || []


  const startPoint =
    trajectory.length
      ? trajectory[0]
      : null


  const currentPoint =
    trajectory.length
      ? trajectory[trajectory.length - 1]
      : null


  return (

    <div className="space-y-6 animate-fadeIn">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <h1 className="text-2xl font-bold text-white">
          Vehicle Trajectory Tracking
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Search a vehicle number to view its
          movement across the camera network
        </p>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="glass-card p-5">

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">

            <Search
              className="absolute left-4 top-1/2
              -translate-y-1/2 w-5 h-5 text-gray-500"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Enter vehicle number e.g. MH12AB1234"
              className="w-full bg-dark-hover
              border border-dark-border rounded-xl
              pl-12 pr-4 py-3 text-white
              placeholder-gray-500
              focus:outline-none focus:border-primary"
            />

          </div>


          <button
            onClick={handleSearch}
            disabled={
              isLoading ||
              !searchQuery.trim()
            }
            className="btn-primary px-6
            flex items-center justify-center gap-2"
          >

            {isLoading ? (

              <>
                <span className="w-4 h-4 border-2
                border-white border-t-transparent
                rounded-full animate-spin" />

                Searching...
              </>

            ) : (

              <>
                <Search className="w-4 h-4" />
                Track Vehicle
              </>

            )}

          </button>


          {hasSearched && (

            <button
              onClick={clearSearch}
              className="btn-secondary px-5"
            >
              Clear
            </button>

          )}

        </div>

      </div>


      {/* =================================================
          NO RESULT
      ================================================= */}

      {hasSearched &&
        !isLoading &&
        !trajectoryData && (

        <div className="glass-card p-8 text-center">

          <AlertCircle
            className="w-10 h-10
            text-warning mx-auto mb-3"
          />

          <h3 className="text-lg
          font-semibold text-white">
            No Trajectory Found
          </h3>

          <p className="text-sm
          text-gray-400 mt-2">
            No tracking data was found for:
          </p>

          <p className="text-primary
          font-mono font-bold mt-2">
            {searchQuery.toUpperCase()}
          </p>

        </div>

      )}


      {/* =================================================
          RESULTS
      ================================================= */}

      {trajectoryData &&
        trajectory.length > 0 && (

        <>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="grid grid-cols-2
          md:grid-cols-4 gap-4">

            <div className="glass-card p-4">

              <div className="flex items-center gap-2">

                <Car className="w-5 h-5 text-primary" />

                <span className="text-xs text-gray-400">
                  Vehicle
                </span>

              </div>

              <p className="text-lg font-bold
              text-white font-mono mt-2">

                {trajectoryData.plate ||
                  selectedVehicle ||
                  'Unknown'}

              </p>

            </div>


            <div className="glass-card p-4">

              <div className="flex items-center gap-2">

                <MapPin className="w-5 h-5 text-success" />

                <span className="text-xs text-gray-400">
                  Tracking Points
                </span>

              </div>

              <p className="text-lg font-bold
              text-white mt-2">

                {trajectory.length}

              </p>

            </div>


            <div className="glass-card p-4">

              <div className="flex items-center gap-2">

                <Camera className="w-5 h-5 text-secondary" />

                <span className="text-xs text-gray-400">
                  Cameras
                </span>

              </div>

              <p className="text-lg font-bold
              text-white mt-2">

                {
                  new Set(
                    trajectory
                      .map(
                        point =>
                          point.camera ||
                          point.camera_id
                      )
                      .filter(Boolean)
                  ).size
                }

              </p>

            </div>


            <div className="glass-card p-4">

              <div className="flex items-center gap-2">

                <Clock className="w-5 h-5 text-warning" />

                <span className="text-xs text-gray-400">
                  Last Seen
                </span>

              </div>

              <p className="text-sm
              font-bold text-white mt-2">

                {currentPoint?.timestamp
                  ? new Date(
                      currentPoint.timestamp
                    ).toLocaleString()
                  : 'Unknown'}

              </p>

            </div>

          </div>


          {/* =================================================
              MAP
          ================================================= */}

          <div className="glass-card p-6">

            <div className="flex items-center
            justify-between mb-4">

              <div>

                <h3 className="text-lg
                font-semibold text-white
                flex items-center gap-2">

                  <Navigation
                    className="w-5 h-5 text-primary"
                  />

                  Vehicle Trajectory

                </h3>

                <p className="text-xs
                text-gray-500 mt-1">

                  Camera-to-camera movement history

                </p>

              </div>


              <button
                onClick={downloadReport}
                className="btn-secondary
                flex items-center gap-2 text-xs"
              >

                <Download className="w-4 h-4" />

                Export

              </button>

            </div>


            <div className="rounded-xl
            overflow-hidden bg-dark-hover">

              <TrajectoryMap
                trajectory={trajectory}
                vehicle={
                  trajectoryData.plate ||
                  selectedVehicle
                }
              />

            </div>


            <div className="flex flex-wrap
            items-center gap-5 mt-4
            text-xs text-gray-400">

              <div className="flex
              items-center gap-2">

                <span className="w-2.5 h-2.5
                rounded-full bg-success" />

                Start

              </div>

              <div className="flex
              items-center gap-2">

                <span className="w-2.5 h-2.5
                rounded-full bg-warning" />

                Camera / Waypoint

              </div>

              <div className="flex
              items-center gap-2">

                <span className="w-2.5 h-2.5
                rounded-full bg-primary" />

                Current

              </div>

            </div>

          </div>


          {/* =================================================
              HISTORY
          ================================================= */}

          <div className="glass-card p-6">

            <div className="flex
            items-center justify-between mb-4">

              <h3 className="text-lg
              font-semibold text-white">

                Tracking History

              </h3>

              <span className="text-xs text-gray-500">

                {trajectory.length} points

              </span>

            </div>


            <div className="space-y-3">

              {trajectory.map(
                (point, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4
                  p-3 rounded-xl bg-dark-hover
                  border border-dark-border"
                >

                  <div className="w-8 h-8
                  rounded-full bg-primary/10
                  flex items-center justify-center
                  text-primary text-xs font-bold">

                    {index + 1}

                  </div>


                  <div className="flex-1">

                    <div className="flex
                    items-center gap-2">

                      <Camera
                        className="w-4 h-4 text-primary"
                      />

                      <span className="text-sm
                      font-semibold text-white">

                        {point.camera ||
                          point.camera_name ||
                          point.camera_id ||
                          'Camera'}

                      </span>

                    </div>


                    <div className="flex
                    items-center gap-2 mt-1
                    text-xs text-gray-500">

                      <MapPin className="w-3 h-3" />

                      {point.latitude ?? 'N/A'},
                      {' '}
                      {point.longitude ?? 'N/A'}

                    </div>

                  </div>


                  <div className="text-right">

                    <p className="text-xs
                    text-gray-400">

                      {point.timestamp
                        ? new Date(
                            point.timestamp
                          ).toLocaleDateString()
                        : 'Unknown'}

                    </p>

                    <p className="text-xs
                    text-primary font-mono mt-1">

                      {point.timestamp
                        ? new Date(
                            point.timestamp
                          ).toLocaleTimeString()
                        : '--:--'}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* =================================================
              TIMELINE
          ================================================= */}

          <div className="glass-card p-6">

            <div className="flex
            items-center gap-2 mb-4">

              <TrendingUp
                className="w-5 h-5 text-primary"
              />

              <h3 className="text-lg
              font-semibold text-white">

                Vehicle Timeline

              </h3>

            </div>


            <VehicleTimeline
              trajectory={trajectory}
              vehicle={
                trajectoryData.plate ||
                selectedVehicle
              }
            />

          </div>


          {/* =================================================
              CURRENT LOCATION
          ================================================= */}

          {currentPoint && (

            <div className="glass-card p-5
            border-l-2 border-primary">

              <div className="flex
              items-start gap-4">

                <div className="p-3 rounded-xl
                bg-primary/10">

                  <MapPin
                    className="w-6 h-6 text-primary"
                  />

                </div>


                <div className="flex-1">

                  <p className="text-xs
                  text-gray-500 uppercase
                  tracking-wider">

                    Current / Last Known Location

                  </p>

                  <h3 className="text-lg
                  font-semibold text-white mt-1">

                    {currentPoint.camera ||
                      currentPoint.camera_name ||
                      currentPoint.camera_id ||
                      'Latest Camera'}

                  </h3>

                  <p className="text-sm
                  text-gray-400 mt-1">

                    {currentPoint.latitude},
                    {' '}
                    {currentPoint.longitude}

                  </p>

                  {currentPoint.timestamp && (

                    <p className="text-xs
                    text-gray-500 mt-2
                    flex items-center gap-2">

                      <Clock className="w-3 h-3" />

                      {new Date(
                        currentPoint.timestamp
                      ).toLocaleString()}

                    </p>

                  )}

                </div>

              </div>

            </div>

          )}

        </>

      )}

    </div>

  )
}


export default TrajectoryTracking