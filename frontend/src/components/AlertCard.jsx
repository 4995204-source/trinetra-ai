import React, { useState } from 'react'
import {
  AlertTriangle,
  Bell,
  Eye,
  MapPin,
  Clock,
  Camera,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

function AlertCard({ alert, onAction }) {
  const [expanded, setExpanded] = useState(false)

  const {
    id,
    type = 'alert',
    priority = 'medium',
    vehicleNumber,
    cameraId,
    location,
    timestamp,
    confidence,
    reason,
    status = 'active',
    actions = []
  } = alert

  const getPriorityConfig = (priority) => {
    const configs = {
      critical: {
        icon: AlertTriangle,
        color: 'danger',
        bg: 'bg-danger/10',
        border: 'border-danger/50',
        text: 'text-danger',
        label: 'CRITICAL'
      },
      high: {
        icon: AlertCircle,
        color: 'danger',
        bg: 'bg-danger/5',
        border: 'border-danger/30',
        text: 'text-danger',
        label: 'HIGH'
      },
      medium: {
        icon: Bell,
        color: 'warning',
        bg: 'bg-warning/5',
        border: 'border-warning/30',
        text: 'text-warning',
        label: 'MEDIUM'
      },
      low: {
        icon: AlertCircle,
        color: 'primary',
        bg: 'bg-primary/5',
        border: 'border-primary/30',
        text: 'text-primary',
        label: 'LOW'
      }
    }
    return configs[priority] || configs.medium
  }

  const priorityConfig = getPriorityConfig(priority)
  const PriorityIcon = priorityConfig.icon

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="badge badge-danger">ACTIVE</span>
    } else if (status === 'reviewed') {
      return <span className="badge badge-success">REVIEWED</span>
    } else if (status === 'resolved') {
      return <span className="badge badge-gray">RESOLVED</span>
    }
    return <span className="badge badge-gray">{status.toUpperCase()}</span>
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--'
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return timestamp
    }
  }

  return (
    <div className={`glass-card glass-card-hover border-l-4 ${priorityConfig.border} overflow-hidden`}>
      <div 
        className="p-4 cursor-pointer hover:bg-dark-hover/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${priorityConfig.bg} ${priorityConfig.text} flex-shrink-0`}>
              <PriorityIcon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-sm font-bold ${priorityConfig.text}`}>
                  {priorityConfig.label} PRIORITY ALERT
                </span>
                {getStatusBadge(status)}
                {type === 'watchlist' && (
                  <span className="badge badge-warning">WATCHLIST</span>
                )}
              </div>
              
              {vehicleNumber && (
                <p className="text-base font-bold text-white font-mono mt-1">
                  {vehicleNumber}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  {cameraId || 'CAM-UNKNOWN'}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {location || 'Unknown Location'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(timestamp)}
                </span>
                {confidence && (
                  <span className={`font-medium ${
                    confidence > 90 ? 'text-success' :
                    confidence > 70 ? 'text-warning' : 'text-danger'
                  }`}>
                    {confidence}% confidence
                  </span>
                )}
              </div>

              {reason && (
                <p className="text-sm text-gray-300 mt-1">
                  Reason: {reason}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-dark-border">
          <div className="flex flex-wrap gap-2 mt-2">
            {actions.length > 0 ? (
              actions.map((action, index) => (
                <button
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-dark-hover hover:bg-dark-border text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  {action}
                </button>
              ))
            ) : (
              <>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-dark-hover hover:bg-dark-border text-gray-300 hover:text-white rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  View Vehicle
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-dark-hover hover:bg-dark-border text-gray-300 hover:text-white rounded-lg transition-colors">
                  <MapPin className="w-4 h-4" />
                  Track Route
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-dark-hover hover:bg-dark-border text-gray-300 hover:text-white rounded-lg transition-colors">
                  <Camera className="w-4 h-4" />
                  View Camera
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AlertCard