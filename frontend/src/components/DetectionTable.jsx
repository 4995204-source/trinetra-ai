import React from 'react'
import { Camera, Clock, CheckCircle, AlertCircle } from 'lucide-react'

function DetectionTable({ detections }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-hover/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Camera</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {detections.map((detection, index) => (
              <tr key={index} className="hover:bg-dark-hover/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-dark-hover flex items-center justify-center overflow-hidden">
                      <span className="text-xs text-gray-500">🚗</span>
                    </div>
                    <span className="text-sm font-medium text-white">{detection.vehicleType}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-bold text-primary">{detection.plate}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm text-gray-300">{detection.cameraId}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-300">{detection.location}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm text-gray-300">{detection.time}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {detection.confidence > 90 ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : detection.confidence > 70 ? (
                      <AlertCircle className="w-4 h-4 text-warning" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-danger" />
                    )}
                    <span className={`text-sm font-medium ${
                      detection.confidence > 90 ? 'text-success' : 
                      detection.confidence > 70 ? 'text-warning' : 'text-danger'
                    }`}>
                      {detection.confidence}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DetectionTable