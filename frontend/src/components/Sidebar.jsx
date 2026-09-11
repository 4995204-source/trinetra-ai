import React from 'react'
import {
  LayoutDashboard,
  Video,
  Search,
  MapPin,
  BarChart3,
  Bell,
  Camera,
  FileText,
  Activity,
  Settings,
  Shield
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Video, label: 'Live Monitoring' },
  { icon: Search, label: 'Vehicle Search' },
  { icon: MapPin, label: 'Trajectory Tracking' },
  { icon: BarChart3, label: 'Traffic Analytics' },
  { icon: Bell, label: 'Alerts & Watchlist' },
  { icon: Camera, label: 'Camera Network' },
  { icon: FileText, label: 'Reports' },
  { icon: Activity, label: 'System Health' },
  { icon: Settings, label: 'Settings' },
]

function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="w-64 bg-dark-card/80 backdrop-blur-sm border-r border-dark-border flex flex-col h-screen">
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">TRINETRA</h1>
            <p className="text-xs text-primary font-medium">AI</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-1 tracking-wider">SMART CITY SURVEILLANCE</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.label
          return (
            <div
              key={item.label}
              onClick={() => setCurrentPage(item.label)}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-8 bg-primary rounded-full" />
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-dark-border">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2">
            <div className="status-dot online" />
            <span className="text-xs text-gray-400">AI Engine</span>
            <span className="text-xs text-success font-medium ml-auto">Online</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="status-dot online" />
            <span className="text-xs text-gray-400">4 Cameras</span>
            <span className="text-xs text-success font-medium ml-auto">Connected</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar