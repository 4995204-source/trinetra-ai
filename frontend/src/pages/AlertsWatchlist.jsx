import React, { useState, useEffect } from 'react'
import {
  Bell,
  Plus,
  Search,
  Eye,
  Trash2,
  Shield,
  XCircle,
  AlertTriangle,
  CheckCircle,
  Car,
  Bike,
  User,
  FileText,
  Clock,
  AlertCircle,
  TrendingUp,
  MapPin,
  Camera
} from 'lucide-react'
import AlertCard from '../components/AlertCard'

function AlertsWatchlist() {
  const [activeTab, setActiveTab] = useState('alerts')
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(false)

  // =========================================================
  // ALERT TYPES
  // =========================================================

  const alertTypes = {
    critical: [
      { type: 'Stolen Vehicle', icon: Car, color: 'danger', description: 'Vehicle reported stolen' },
      { type: 'Hit & Run', icon: Car, color: 'danger', description: 'Vehicle fled after accident' },
      { type: 'Accidental', icon: AlertCircle, color: 'danger', description: 'Vehicle involved in accident' }
    ],
    high: [
      { type: 'Rash Driving', icon: TrendingUp, color: 'warning', description: 'Dangerous driving detected' },
      { type: 'Suspicious Activity', icon: AlertTriangle, color: 'warning', description: 'Suspicious vehicle behavior' },
      { type: 'Document Issue', icon: FileText, color: 'warning', description: 'Invalid documents detected' }
    ],
    medium: [
      { type: 'No Helmet', icon: Bike, color: 'primary', description: 'Rider without helmet' },
      { type: 'No Seatbelt', icon: Car, color: 'primary', description: 'Driver without seatbelt' },
      { type: 'Over Speeding', icon: TrendingUp, color: 'primary', description: 'Vehicle exceeding speed limit' }
    ]
  }

  // =========================================================
  // DEMO ALERTS DATA
  // =========================================================

  const [alerts, setAlerts] = useState([
    // Stolen Vehicle Alerts
    {
      id: 1,
      type: 'watchlist',
      priority: 'critical',
      alertType: 'Stolen Vehicle',
      vehicleNumber: 'MH14AB1234',
      cameraId: 'CAM-003',
      location: 'Baner Road',
      timestamp: '2026-09-01T10:42:31',
      confidence: 97,
      reason: 'Stolen Vehicle - Reported 2 days ago from Wakad',
      status: 'active',
      details: 'Vehicle reported stolen from Wakad area. High priority alert issued. Owner: Rajesh Kumar, Model: Honda City 2023.',
      severity: 'Critical',
      icon: Car,
      color: 'danger',
      action: 'Stolen Vehicle Alert'
    },
    {
      id: 2,
      type: 'watchlist',
      priority: 'critical',
      alertType: 'Stolen Vehicle',
      vehicleNumber: 'MH12XY5678',
      cameraId: 'CAM-001',
      location: 'Wakad Junction',
      timestamp: '2026-09-01T10:38:15',
      confidence: 94,
      reason: 'Stolen Vehicle - Reported 5 days ago',
      status: 'active',
      details: 'Vehicle reported stolen from Hinjawadi. Owner: Sneha Patil, Model: Maruti Suzuki Swift 2022.',
      severity: 'Critical',
      icon: Car,
      color: 'danger',
      action: 'Stolen Vehicle Alert'
    },

    // Hit & Run Alerts
    {
      id: 3,
      type: 'watchlist',
      priority: 'critical',
      alertType: 'Hit & Run',
      vehicleNumber: 'MH14CD9999',
      cameraId: 'CAM-002',
      location: 'Hinjawadi Phase 1',
      timestamp: '2026-09-01T10:35:22',
      confidence: 88,
      reason: 'Hit & Run - Vehicle fled after accident at Hinjawadi',
      status: 'active',
      details: 'Vehicle involved in hit and run case at Hinjawadi. Pedestrian injured. Vehicle fled towards Baner. Case filed at Hinjawadi Police Station.',
      severity: 'Critical',
      icon: Car,
      color: 'danger',
      action: 'Hit & Run Alert'
    },
    {
      id: 4,
      type: 'watchlist',
      priority: 'critical',
      alertType: 'Hit & Run',
      vehicleNumber: 'MH15EF3456',
      cameraId: 'CAM-004',
      location: 'Shivajinagar',
      timestamp: '2026-09-01T10:30:45',
      confidence: 91,
      reason: 'Hit & Run - Vehicle hit a bike and fled',
      status: 'active',
      details: 'Vehicle hit a motorcycle near Shivajinagar and fled. One person injured. Police case registered.',
      severity: 'Critical',
      icon: Car,
      color: 'danger',
      action: 'Hit & Run Alert'
    },

    // Accidental Vehicles
    {
      id: 5,
      type: 'alert',
      priority: 'critical',
      alertType: 'Accidental',
      vehicleNumber: 'MH14GH7890',
      cameraId: 'CAM-005',
      location: 'Aundh Bridge',
      timestamp: '2026-09-01T10:28:30',
      confidence: 93,
      reason: 'Accident Detected - Vehicle collided with divider',
      status: 'active',
      details: 'Vehicle collided with divider at Aundh Bridge. Driver injured. Ambulance dispatched. Police notified.',
      severity: 'Critical',
      icon: AlertCircle,
      color: 'danger',
      action: 'Accident Alert'
    },
    {
      id: 6,
      type: 'alert',
      priority: 'high',
      alertType: 'Accidental',
      vehicleNumber: 'MH12JK2345',
      cameraId: 'CAM-006',
      location: 'Pune Station',
      timestamp: '2026-09-01T10:25:15',
      confidence: 86,
      reason: 'Accident Detected - Multiple vehicle collision',
      status: 'active',
      details: 'Multiple vehicle collision at Pune Station area. 3 vehicles involved. Emergency services alerted.',
      severity: 'High',
      icon: AlertCircle,
      color: 'warning',
      action: 'Accident Alert'
    },

    // Rash Driving Alerts
    {
      id: 7,
      type: 'alert',
      priority: 'high',
      alertType: 'Rash Driving',
      vehicleNumber: 'MH14LM6789',
      cameraId: 'CAM-007',
      location: 'Kharadi Bypass',
      timestamp: '2026-09-01T10:22:00',
      confidence: 92,
      reason: 'Rash Driving - Vehicle driving at 120 km/h in 60 km/h zone',
      status: 'active',
      details: 'Vehicle spotted driving at 120 km/h on Kharadi Bypass. Speed limit is 60 km/h. Dangerous driving pattern detected.',
      severity: 'High',
      icon: TrendingUp,
      color: 'warning',
      action: 'Rash Driving Alert'
    },
    {
      id: 8,
      type: 'alert',
      priority: 'high',
      alertType: 'Rash Driving',
      vehicleNumber: 'MH12NO3456',
      cameraId: 'CAM-008',
      location: 'Viman Nagar',
      timestamp: '2026-09-01T10:18:45',
      confidence: 89,
      reason: 'Rash Driving - Zigzag driving pattern detected',
      status: 'active',
      details: 'Vehicle observed driving in zigzag pattern on Viman Nagar road. Suspicious behavior. Police notified.',
      severity: 'High',
      icon: TrendingUp,
      color: 'warning',
      action: 'Rash Driving Alert'
    },

    // Suspicious Activity
    {
      id: 9,
      type: 'alert',
      priority: 'high',
      alertType: 'Suspicious Activity',
      vehicleNumber: 'MH14PQ7890',
      cameraId: 'CAM-009',
      location: 'Hadapsar',
      timestamp: '2026-09-01T10:15:30',
      confidence: 87,
      reason: 'Suspicious Activity - Vehicle circling area repeatedly',
      status: 'active',
      details: 'Vehicle observed circling Hadapsar area for 30+ minutes. Multiple passes detected. Alerting local police.',
      severity: 'High',
      icon: AlertTriangle,
      color: 'warning',
      action: 'Suspicious Activity Alert'
    },

    // No Helmet
    {
      id: 10,
      type: 'alert',
      priority: 'medium',
      alertType: 'No Helmet',
      vehicleNumber: 'MH15RS2345',
      cameraId: 'CAM-010',
      location: 'Koregaon Park',
      timestamp: '2026-09-01T10:12:20',
      confidence: 95,
      reason: 'No Helmet - Motorcycle rider without helmet',
      status: 'active',
      details: 'Motorcycle rider observed without helmet on Koregaon Park road. Safety violation.',
      severity: 'Medium',
      icon: Bike,
      color: 'primary',
      action: 'No Helmet Alert'
    },

    // Over Speeding
    {
      id: 11,
      type: 'alert',
      priority: 'medium',
      alertType: 'Over Speeding',
      vehicleNumber: 'MH14TU6789',
      cameraId: 'CAM-011',
      location: 'Deccan',
      timestamp: '2026-09-01T10:10:00',
      confidence: 90,
      reason: 'Over Speeding - Vehicle at 95 km/h in 40 km/h zone',
      status: 'active',
      details: 'Vehicle speeding at 95 km/h on Deccan road. Speed limit is 40 km/h. Challan issued.',
      severity: 'Medium',
      icon: TrendingUp,
      color: 'primary',
      action: 'Speeding Alert'
    },

    // Resolved Alerts (For demo)
    {
      id: 12,
      type: 'alert',
      priority: 'high',
      alertType: 'Stolen Vehicle',
      vehicleNumber: 'MH12VW3456',
      cameraId: 'CAM-001',
      location: 'Wakad',
      timestamp: '2026-08-31T18:30:00',
      confidence: 96,
      reason: 'Stolen Vehicle - Vehicle recovered',
      status: 'reviewed',
      details: 'Vehicle recovered by police. Case closed. Vehicle returned to owner.',
      severity: 'High',
      icon: Car,
      color: 'success',
      action: 'Resolved - Vehicle Recovered'
    }
  ])

  // =========================================================
  // WATCHLIST
  // =========================================================

  const [watchlist, setWatchlist] = useState([
    {
      id: 1,
      vehicleNumber: 'MH14AB1234',
      reason: 'Stolen Vehicle',
      priority: 'CRITICAL',
      status: 'ACTIVE',
      addedBy: 'Admin',
      addedDate: '2026-08-25',
      alertType: 'Stolen Vehicle'
    },
    {
      id: 2,
      vehicleNumber: 'MH12XY5678',
      reason: 'Stolen Vehicle',
      priority: 'CRITICAL',
      status: 'ACTIVE',
      addedBy: 'Admin',
      addedDate: '2026-08-26',
      alertType: 'Stolen Vehicle'
    },
    {
      id: 3,
      vehicleNumber: 'MH14CD9999',
      reason: 'Hit & Run',
      priority: 'CRITICAL',
      status: 'ACTIVE',
      addedBy: 'Admin',
      addedDate: '2026-08-27',
      alertType: 'Hit & Run'
    },
    {
      id: 4,
      vehicleNumber: 'MH15EF3456',
      reason: 'Hit & Run',
      priority: 'CRITICAL',
      status: 'ACTIVE',
      addedBy: 'Admin',
      addedDate: '2026-08-27',
      alertType: 'Hit & Run'
    },
    {
      id: 5,
      vehicleNumber: 'MH14GH7890',
      reason: 'Accidental',
      priority: 'HIGH',
      status: 'ACTIVE',
      addedBy: 'Admin',
      addedDate: '2026-08-28',
      alertType: 'Accidental'
    },
    {
      id: 6,
      vehicleNumber: 'MH14LM6789',
      reason: 'Rash Driving',
      priority: 'HIGH',
      status: 'ACTIVE',
      addedBy: 'Admin',
      addedDate: '2026-08-28',
      alertType: 'Rash Driving'
    }
  ])

  const [newWatchlistItem, setNewWatchlistItem] = useState({
    vehicleNumber: '',
    reason: '',
    priority: 'HIGH',
    alertType: 'Stolen Vehicle'
  })

  // =========================================================
  // EFFECTS
  // =========================================================

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/watchlist')
      const data = await response.json()
      if (data.success && data.watchlist.length > 0) {
        setWatchlist(data.watchlist.map((w, index) => ({
          id: index + 1,
          vehicleNumber: w.plate,
          reason: w.reason || 'Suspicious',
          priority: w.priority || 'HIGH',
          status: w.status?.toUpperCase() || 'ACTIVE',
          addedBy: 'Admin',
          addedDate: w.added_at ? new Date(w.added_at).toLocaleDateString() : new Date().toLocaleDateString(),
          alertType: 'Suspicious'
        })))
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    }
  }

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleAlertAction = ({ alertId, action }) => {
    if (action === 'review' || action === 'dismiss') {
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: action === 'review' ? 'reviewed' : 'resolved' }
          : alert
      ))
    }
  }

  const handleAddWatchlist = async () => {
    if (!newWatchlistItem.vehicleNumber || !newWatchlistItem.reason) return
    
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/watchlist/${newWatchlistItem.vehicleNumber}?reason=${encodeURIComponent(newWatchlistItem.reason)}`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        const newItem = {
          id: watchlist.length + 1,
          ...newWatchlistItem,
          status: 'ACTIVE',
          addedBy: 'Admin',
          addedDate: new Date().toLocaleDateString(),
          alertType: newWatchlistItem.alertType
        }
        setWatchlist([...watchlist, newItem])
        setNewWatchlistItem({ vehicleNumber: '', reason: '', priority: 'HIGH', alertType: 'Stolen Vehicle' })
        setShowAddModal(false)
        alert('✅ Added to watchlist successfully!')
      } else {
        alert('❌ ' + data.message)
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      alert('❌ Failed to add to watchlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveWatchlist = async (id) => {
    const item = watchlist.find(w => w.id === id)
    if (!item) return
    
    try {
      const response = await fetch(`http://localhost:8000/api/watchlist/${item.vehicleNumber}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setWatchlist(watchlist.filter(item => item.id !== id))
        alert('✅ Removed from watchlist')
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      alert('❌ Failed to remove from watchlist')
    }
  }

  // =========================================================
  // FILTERS
  // =========================================================

  const filteredAlerts = alerts.filter(alert => {
    if (filterPriority !== 'all' && alert.priority !== filterPriority) return false
    if (filterType !== 'all' && alert.alertType !== filterType) return false
    if (searchQuery && !alert.vehicleNumber.includes(searchQuery.toUpperCase())) return false
    return true
  })

  const activeAlerts = alerts.filter(a => a.status === 'active')
  const criticalAlerts = alerts.filter(a => a.priority === 'critical' && a.status === 'active')
  const highAlerts = alerts.filter(a => a.priority === 'high' && a.status === 'active')
  const mediumAlerts = alerts.filter(a => a.priority === 'medium' && a.status === 'active')

  // Count by type
  const typeCounts = {
    'Stolen Vehicle': alerts.filter(a => a.alertType === 'Stolen Vehicle' && a.status === 'active').length,
    'Hit & Run': alerts.filter(a => a.alertType === 'Hit & Run' && a.status === 'active').length,
    'Accidental': alerts.filter(a => a.alertType === 'Accidental' && a.status === 'active').length,
    'Rash Driving': alerts.filter(a => a.alertType === 'Rash Driving' && a.status === 'active').length,
    'Suspicious Activity': alerts.filter(a => a.alertType === 'Suspicious Activity' && a.status === 'active').length,
    'No Helmet': alerts.filter(a => a.alertType === 'No Helmet' && a.status === 'active').length
  }

  const getPriorityColor = (priority) => {
    const colors = {
      CRITICAL: 'text-danger',
      HIGH: 'text-danger',
      MEDIUM: 'text-warning',
      LOW: 'text-primary'
    }
    return colors[priority] || 'text-gray-400'
  }

  const getStatusBadge = (status) => {
    const statuses = {
      ACTIVE: 'badge-danger',
      REVIEWED: 'badge-warning',
      RESOLVED: 'badge-success'
    }
    return statuses[status] || 'badge-gray'
  }

  const getAlertTypeIcon = (alertType) => {
    const icons = {
      'Stolen Vehicle': Car,
      'Hit & Run': Car,
      'Accidental': AlertCircle,
      'Rash Driving': TrendingUp,
      'Suspicious Activity': AlertTriangle,
      'No Helmet': Bike,
      'No Seatbelt': Car,
      'Over Speeding': TrendingUp
    }
    return icons[alertType] || AlertCircle
  }

  const getAlertTypeColor = (alertType) => {
    const colors = {
      'Stolen Vehicle': 'danger',
      'Hit & Run': 'danger',
      'Accidental': 'danger',
      'Rash Driving': 'warning',
      'Suspicious Activity': 'warning',
      'No Helmet': 'primary',
      'No Seatbelt': 'primary',
      'Over Speeding': 'primary'
    }
    return colors[alertType] || 'gray'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts & Watchlist</h1>
          <p className="text-sm text-gray-400 mt-1">
            Monitor stolen vehicles, hit & run cases, accidents, rash driving, and suspicious vehicles
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add to Watchlist
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="glass-card p-4 text-center border-l-4 border-danger">
          <p className="text-xs text-gray-400">Total Alerts</p>
          <p className="text-2xl font-bold text-danger">{activeAlerts.length}</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-danger">
          <p className="text-xs text-gray-400">Stolen Vehicle</p>
          <p className="text-2xl font-bold text-danger">{typeCounts['Stolen Vehicle']}</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-danger">
          <p className="text-xs text-gray-400">Hit & Run</p>
          <p className="text-2xl font-bold text-danger">{typeCounts['Hit & Run']}</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-danger">
          <p className="text-xs text-gray-400">Accidental</p>
          <p className="text-2xl font-bold text-danger">{typeCounts['Accidental']}</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-warning">
          <p className="text-xs text-gray-400">Rash Driving</p>
          <p className="text-2xl font-bold text-warning">{typeCounts['Rash Driving']}</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-primary">
          <p className="text-xs text-gray-400">Other Alerts</p>
          <p className="text-2xl font-bold text-primary">
            {activeAlerts.length - typeCounts['Stolen Vehicle'] - typeCounts['Hit & Run'] - typeCounts['Accidental'] - typeCounts['Rash Driving']}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <input
              type="text"
              placeholder="Search by vehicle number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="select-field w-40"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select-field w-48"
          >
            <option value="all">All Alert Types</option>
            <option value="Stolen Vehicle">🚗 Stolen Vehicle</option>
            <option value="Hit & Run">💥 Hit & Run</option>
            <option value="Accidental">🆘 Accidental</option>
            <option value="Rash Driving">🏎️ Rash Driving</option>
            <option value="Suspicious Activity">⚠️ Suspicious</option>
            <option value="No Helmet">🏍️ No Helmet</option>
          </select>
        </div>
      </div>

      {/* Alert Type Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            filterType === 'all'
              ? 'bg-primary text-white border-primary'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType('Stolen Vehicle')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            filterType === 'Stolen Vehicle'
              ? 'bg-danger text-white border-danger'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          🚗 Stolen Vehicle
        </button>
        <button
          onClick={() => setFilterType('Hit & Run')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            filterType === 'Hit & Run'
              ? 'bg-danger text-white border-danger'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          💥 Hit & Run
        </button>
        <button
          onClick={() => setFilterType('Accidental')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            filterType === 'Accidental'
              ? 'bg-danger text-white border-danger'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          🆘 Accidental
        </button>
        <button
          onClick={() => setFilterType('Rash Driving')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            filterType === 'Rash Driving'
              ? 'bg-warning text-white border-warning'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          🏎️ Rash Driving
        </button>
        <button
          onClick={() => setFilterType('Suspicious Activity')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            filterType === 'Suspicious Activity'
              ? 'bg-warning text-white border-warning'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          ⚠️ Suspicious
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-border">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'alerts'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          Active Alerts ({activeAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'watchlist'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Watchlist ({watchlist.length})
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'alerts' ? (
          <div className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map(alert => {
                const Icon = getAlertTypeIcon(alert.alertType)
                const color = getAlertTypeColor(alert.alertType)
                
                return (
                  <div key={alert.id} className={`glass-card glass-card-hover border-l-4 ${
                    color === 'danger' ? 'border-danger' :
                    color === 'warning' ? 'border-warning' :
                    'border-primary'
                  } overflow-hidden`}>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${
                            color === 'danger' ? 'bg-danger/10 text-danger' :
                            color === 'warning' ? 'bg-warning/10 text-warning' :
                            'bg-primary/10 text-primary'
                          } flex-shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-sm font-bold ${
                                color === 'danger' ? 'text-danger' :
                                color === 'warning' ? 'text-warning' :
                                'text-primary'
                              }`}>
                                {alert.alertType?.toUpperCase() || 'ALERT'}
                              </span>
                              {alert.priority === 'critical' && (
                                <span className="badge badge-danger">CRITICAL</span>
                              )}
                              {alert.priority === 'high' && (
                                <span className="badge badge-warning">HIGH</span>
                              )}
                              {alert.status === 'active' && (
                                <span className="badge badge-danger">ACTIVE</span>
                              )}
                            </div>
                            
                            <p className="text-base font-bold text-white font-mono mt-1">
                              {alert.vehicleNumber}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <Camera className="w-3.5 h-3.5" />
                                {alert.cameraId}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {alert.location}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(alert.timestamp).toLocaleString()}
                              </span>
                              <span className={`font-medium ${
                                alert.confidence > 90 ? 'text-success' :
                                alert.confidence > 70 ? 'text-warning' : 'text-danger'
                              }`}>
                                {alert.confidence}% confidence
                              </span>
                            </div>

                            <p className="text-sm text-gray-300 mt-1">
                              {alert.reason}
                            </p>
                            {alert.details && (
                              <p className="text-xs text-gray-400 mt-1">
                                {alert.details}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleAlertAction({ alertId: alert.id, action: 'review' })}
                            className="btn-primary text-xs py-1 px-3"
                          >
                            <Eye className="w-3 h-3 inline mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleAlertAction({ alertId: alert.id, action: 'dismiss' })}
                            className="btn-secondary text-xs py-1 px-3"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="glass-card p-12 text-center">
                <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white">No Alerts</h3>
                <p className="text-gray-400 mt-2">No active alerts matching your filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-hover/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Alert Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Added</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {watchlist.map((item) => (
                    <tr key={item.id} className="hover:bg-dark-hover/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-primary">{item.vehicleNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${
                          item.alertType === 'Stolen Vehicle' || item.alertType === 'Hit & Run' ? 'badge-danger' :
                          item.alertType === 'Rash Driving' || item.alertType === 'Suspicious Activity' ? 'badge-warning' :
                          'badge-primary'
                        }`}>
                          {item.alertType || 'Suspicious'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{item.reason}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{item.addedDate}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 hover:bg-dark-hover rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button 
                            onClick={() => handleRemoveWatchlist(item.id)}
                            className="p-1.5 hover:bg-danger/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-danger" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Watchlist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add to Watchlist</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  value={newWatchlistItem.vehicleNumber}
                  onChange={(e) => setNewWatchlistItem({
                    ...newWatchlistItem,
                    vehicleNumber: e.target.value.toUpperCase()
                  })}
                  placeholder="e.g., MH14AB1234"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Alert Type *
                </label>
                <select
                  value={newWatchlistItem.alertType}
                  onChange={(e) => setNewWatchlistItem({
                    ...newWatchlistItem,
                    alertType: e.target.value
                  })}
                  className="select-field"
                >
                  <option value="Stolen Vehicle">🚗 Stolen Vehicle</option>
                  <option value="Hit & Run">💥 Hit & Run</option>
                  <option value="Accidental">🆘 Accidental</option>
                  <option value="Rash Driving">🏎️ Rash Driving</option>
                  <option value="Suspicious Activity">⚠️ Suspicious Activity</option>
                  <option value="No Helmet">🏍️ No Helmet</option>
                  <option value="Over Speeding">📊 Over Speeding</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Reason *
                </label>
                <input
                  type="text"
                  value={newWatchlistItem.reason}
                  onChange={(e) => setNewWatchlistItem({
                    ...newWatchlistItem,
                    reason: e.target.value
                  })}
                  placeholder="e.g., Stolen Vehicle from Wakad"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Priority
                </label>
                <select
                  value={newWatchlistItem.priority}
                  onChange={(e) => setNewWatchlistItem({
                    ...newWatchlistItem,
                    priority: e.target.value
                  })}
                  className="select-field"
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <p className="text-xs text-gray-500">
                ⚠️ Adding to watchlist will trigger alerts when this vehicle is detected
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWatchlist}
                disabled={loading}
                className="flex-1 btn-primary"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  'Add to Watchlist'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlertsWatchlist