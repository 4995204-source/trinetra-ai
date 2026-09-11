import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Video, Camera, Wifi, WifiOff } from 'lucide-react'

function CameraCard({ camera }) {
  const { id, name, location, status, vehicleCount, trafficLevel, feed, isPhone = false } = camera
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [frameUrl, setFrameUrl] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const imgRef = useRef(null)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  const trafficColors = {
    Low: 'text-green-400 border-green-500/30 bg-green-500/10',
    Medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    Heavy: 'text-red-400 border-red-500/30 bg-red-500/10',
  }

  useEffect(() => {
    const baseUrl = feed || `http://localhost:8000/api/camera/${id}/frame`
    setFrameUrl(baseUrl)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (status === 'online') {
      intervalRef.current = setInterval(() => {
        if (imgRef.current && !error) {
          setFrameUrl(`${baseUrl}?t=${Date.now()}`)
        }
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [id, feed, status, error])

  useEffect(() => {
    if (imgRef.current) {
      const img = imgRef.current
      
      const handleLoad = () => {
        setIsLoading(false)
        setError(false)
        setRetryCount(0)
      }
      
      const handleError = () => {
        setError(true)
        setIsLoading(false)
        
        if (status === 'online' && retryCount < 3) {
          timeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1)
            setError(false)
            setIsLoading(true)
            setFrameUrl(`${feed || `http://localhost:8000/api/camera/${id}/frame`}?t=${Date.now()}`)
          }, 3000)
        }
      }
      
      img.addEventListener('load', handleLoad)
      img.addEventListener('error', handleError)
      
      return () => {
        img.removeEventListener('load', handleLoad)
        img.removeEventListener('error', handleError)
      }
    }
  }, [id, feed, status, frameUrl, retryCount])

  const handleRetry = () => {
    setRetryCount(0)
    setIsLoading(true)
    setError(false)
    setFrameUrl(`${feed || `http://localhost:8000/api/camera/${id}/frame`}?t=${Date.now()}`)
  }

  return (
    <div className="glass-card glass-card-hover overflow-hidden">
      <div className="relative aspect-video bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          {status === 'online' ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 z-10">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-500 mt-2">Loading feed...</span>
                </div>
              )}
              {error ? (
                <div className="flex flex-col items-center gap-3 text-gray-600 p-4">
                  <Camera className="w-12 h-12" />
                  <span className="text-sm">Camera Unavailable</span>
                  <span className="text-xs text-gray-500">Retry {retryCount}/3</span>
                  <button 
                    onClick={handleRetry}
                    className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
                  >
                    Retry Now
                  </button>
                </div>
              ) : (
                <img
                  ref={imgRef}
                  src={frameUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <Video className="w-12 h-12" />
              <span className="text-sm">Camera Offline</span>
            </div>
          )}
        </div>
        
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1.5 ${
            status === 'online' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            {status === 'online' ? 'LIVE' : 'OFFLINE'}
          </span>
          <span className="text-xs text-gray-300 bg-black/60 px-2 py-0.5 rounded">{id}</span>
          {isPhone && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">📱 Phone</span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <p className="text-sm font-medium text-white flex items-center gap-2">
              {isPhone ? '📱' : '💻'} {name}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {location}
            </p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-right">
            <p className="text-sm font-bold text-white">{vehicleCount || 0}</p>
            <p className="text-xs text-gray-400">vehicles</p>
          </div>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2">
          {status === 'online' ? (
            <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${trafficColors[trafficLevel] || trafficColors.Low}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {trafficLevel || 'Low'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CameraCard