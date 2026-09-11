import React from 'react'
import { Clock, MapPin, Camera, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react'

function VehicleTimeline({ trajectory, vehicleNumber }) {
  if (!trajectory || trajectory.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-400">No trajectory data available</p>
      </div>
    )
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--'
    if (timestamp.includes(':')) return timestamp
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      })
    } catch {
      return timestamp
    }
  }

  const totalCameras = trajectory.length
  const startTime = trajectory[0]?.timestamp
  const endTime = trajectory[trajectory.length - 1]?.timestamp
  const startLocation = trajectory[0]?.location || 'Unknown'
  const endLocation = trajectory[trajectory.length - 1]?.location || 'Unknown'

  let travelTime = '--'
  if (startTime && endTime) {
    try {
      const start = new Date(startTime)
      const end = new Date(endTime)
      if (!isNaN(start) && !isNaN(end)) {
        const diffMs = end - start
        const diffMins = Math.floor(diffMs / 60000)
        if (diffMins > 0) {
          const hours = Math.floor(diffMins / 60)
          const mins = diffMins % 60
          travelTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
        } else {
          travelTime = '< 1m'
        }
      }
    } catch {
      travelTime = '--'
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Vehicle Trajectory
          </h3>
          {vehicleNumber && (
            <p className="text-sm text-gray-400 font-mono mt-1">
              Vehicle: <span className="text-primary font-bold">{vehicleNumber}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Cameras:</span>
            <span className="text-white font-bold">{totalCameras}</span>
          </div>
          <div className="h-6 w-px bg-dark-border" />
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Travel Time:</span>
            <span className="text-secondary font-bold">{travelTime}</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 mb-6 bg-dark-hover/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-gray-300">Start: {startLocation}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-gray-300">End: {endLocation}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{formatTime(startTime)} → {formatTime(endTime)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-0 relative">
        {trajectory.map((point, index) => {
          const isFirst = index === 0
          const isLast = index === trajectory.length - 1
          const statusColor = isFirst ? 'success' : isLast ? 'primary' : 'warning'
          
          return (
            <div key={index} className="timeline-item">
              <div className={`timeline-dot ${statusColor}`} />
              
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${
                      isFirst ? 'text-success' : 
                      isLast ? 'text-primary' : 
                      'text-white'
                    }`}>
                      {isFirst ? '📍 Start' : isLast ? '🏁 End' : `📍 Waypoint ${index}`}
                    </span>
                    {isFirst && <span className="badge badge-success text-xs">First Seen</span>}
                    {isLast && <span className="badge badge-primary text-xs">Last Seen</span>}
                  </div>
                  
                  <p className="text-base font-semibold text-white mt-1">
                    {point.location}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      {point.camera_id || point.cameraId || `CAM-${String(index + 1).padStart(3, '0')}`}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(point.timestamp)}
                    </span>
                    {point.confidence && (
                      <span className={`flex items-center gap-1.5 ${
                        point.confidence > 90 ? 'text-success' :
                        point.confidence > 70 ? 'text-warning' : 'text-danger'
                      }`}>
                        {point.confidence > 90 ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5" />
                        )}
                        {point.confidence}% confidence
                      </span>
                    )}
                  </div>
                </div>

                {!isLast && (
                  <div className="flex items-center text-gray-500">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VehicleTimeline