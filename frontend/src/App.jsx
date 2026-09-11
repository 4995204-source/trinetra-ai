import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import LiveMonitoring from './pages/LiveMonitoring'
import VehicleSearch from './pages/VehicleSearch'
import TrajectoryTracking from './pages/TrajectoryTracking'
import TrafficAnalytics from './pages/TrafficAnalytics'
import AlertsWatchlist from './pages/AlertsWatchlist'
import CameraNetwork from './pages/CameraNetwork'
import Reports from './pages/Reports'
import SystemHealth from './pages/SystemHealth'
import Settings from './pages/Settings'

function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />
      case 'Live Monitoring':
        return <LiveMonitoring />
      case 'Vehicle Search':
        return <VehicleSearch />
      case 'Trajectory Tracking':
        return <TrajectoryTracking />
      case 'Traffic Analytics':
        return <TrafficAnalytics />
      case 'Alerts & Watchlist':
        return <AlertsWatchlist />
      case 'Camera Network':
        return <CameraNetwork />
      case 'Reports':
        return <Reports />
      case 'System Health':
        return <SystemHealth />
      case 'Settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App