import React, { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  Printer,
  Search,
  TrendingUp,
  AlertCircle,
  Camera,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  File,
  Users,
  Shield,
  Car,
  Bike,
  Truck,
  Bus,
  MapPin,
  DollarSign,
  BarChart3,
  UserCheck,
  FileCheck,
  ClipboardCheck,
  AlertOctagon
} from 'lucide-react'

function Reports() {
  const [analytics, setAnalytics] = useState(null)
  const [plates, setPlates] = useState([])
  const [violations, setViolations] = useState([])
  const [challans, setChallans] = useState([])
  const [documents, setDocuments] = useState([])
  const [noHelmet, setNoHelmet] = useState([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // =========================================================
  // DEMO DATA - VIOLATIONS
  // =========================================================

  const demoViolations = [
    // CRITICAL PRIORITY - Hit & Run, Stolen Vehicle, Accidental
    {
      id: 1,
      plate: 'MH14AB1234',
      vehicle_type: 'Car',
      violation_type: 'Hit & Run',
      location: 'Wakad Junction',
      timestamp: '2026-09-01T10:42:31',
      priority: 'Critical',
      severity: 'Critical',
      fine: 5000,
      status: 'Pending',
      description: 'Vehicle fled after hitting pedestrian',
      camera_id: 'CAM-001',
      category: 'Critical'
    },
    {
      id: 2,
      plate: 'MH12XY5678',
      vehicle_type: 'Car',
      violation_type: 'Stolen Vehicle',
      location: 'Baner Road',
      timestamp: '2026-09-01T10:38:15',
      priority: 'Critical',
      severity: 'Critical',
      fine: 0,
      status: 'Active',
      description: 'Vehicle reported stolen 2 days ago',
      camera_id: 'CAM-003',
      category: 'Critical'
    },
    {
      id: 3,
      plate: 'MH14CD9999',
      vehicle_type: 'Truck',
      violation_type: 'Accidental',
      location: 'Hinjawadi Phase 1',
      timestamp: '2026-09-01T10:35:22',
      priority: 'Critical',
      severity: 'Critical',
      fine: 10000,
      status: 'Pending',
      description: 'Vehicle involved in major accident',
      camera_id: 'CAM-002',
      category: 'Critical'
    },

    // HIGH PRIORITY - Challans & Document Verification
    {
      id: 4,
      plate: 'MH15EF3456',
      vehicle_type: 'Car',
      violation_type: 'Challan - Over Speeding',
      location: 'Shivajinagar',
      timestamp: '2026-09-01T10:30:45',
      priority: 'High',
      severity: 'High',
      fine: 2000,
      status: 'Pending',
      description: 'Speeding at 85 km/h in 40 km/h zone. Challan issued.',
      camera_id: 'CAM-004',
      category: 'High',
      challan_number: 'CHN-2026-004',
      due_date: '2026-09-10'
    },
    {
      id: 5,
      plate: 'MH14GH7890',
      vehicle_type: 'Bike',
      violation_type: 'Challan - Signal Jump',
      location: 'Aundh Bridge',
      timestamp: '2026-09-01T10:28:30',
      priority: 'High',
      severity: 'High',
      fine: 1500,
      status: 'Pending',
      description: 'Jumped red signal. Challan issued.',
      camera_id: 'CAM-005',
      category: 'High',
      challan_number: 'CHN-2026-005',
      due_date: '2026-09-10'
    },
    {
      id: 6,
      plate: 'MH12JK2345',
      vehicle_type: 'Car',
      violation_type: 'Document Verification',
      location: 'Pune Station',
      timestamp: '2026-09-01T10:25:15',
      priority: 'High',
      severity: 'High',
      fine: 3000,
      status: 'Pending',
      description: 'Expired registration and insurance. Document verification required.',
      camera_id: 'CAM-006',
      category: 'High',
      document_type: 'Registration + Insurance',
      expiry_date: '2026-08-15'
    },
    {
      id: 7,
      plate: 'MH14LM6789',
      vehicle_type: 'Car',
      violation_type: 'Document Verification',
      location: 'Kharadi Bypass',
      timestamp: '2026-09-01T10:22:00',
      priority: 'High',
      severity: 'High',
      fine: 2500,
      status: 'Pending',
      description: 'Invalid driving license. Document verification required.',
      camera_id: 'CAM-007',
      category: 'High',
      document_type: 'Driving License',
      expiry_date: '2026-07-20'
    },
    {
      id: 8,
      plate: 'MH12NO3456',
      vehicle_type: 'Truck',
      violation_type: 'Challan - Overloading',
      location: 'Viman Nagar',
      timestamp: '2026-09-01T10:18:45',
      priority: 'High',
      severity: 'High',
      fine: 5000,
      status: 'Pending',
      description: 'Vehicle overloaded beyond capacity. Challan issued.',
      camera_id: 'CAM-008',
      category: 'High',
      challan_number: 'CHN-2026-008',
      due_date: '2026-09-12'
    },

    // MEDIUM PRIORITY - No Helmet (Motorcycle)
    {
      id: 9,
      plate: 'MH15RS2345',
      vehicle_type: 'Motorcycle',
      violation_type: 'No Helmet',
      location: 'Koregaon Park',
      timestamp: '2026-09-01T10:12:20',
      priority: 'Medium',
      severity: 'Medium',
      fine: 1000,
      status: 'Pending',
      description: 'Motorcycle rider without helmet',
      camera_id: 'CAM-009',
      category: 'Medium',
      helmet_required: true,
      rider_count: 1
    },
    {
      id: 10,
      plate: 'MH14TU6789',
      vehicle_type: 'Motorcycle',
      violation_type: 'No Helmet',
      location: 'Deccan',
      timestamp: '2026-09-01T10:10:00',
      priority: 'Medium',
      severity: 'Medium',
      fine: 1000,
      status: 'Pending',
      description: 'Motorcycle rider without helmet',
      camera_id: 'CAM-010',
      category: 'Medium',
      helmet_required: true,
      rider_count: 2
    },
    {
      id: 11,
      plate: 'MH12VW3456',
      vehicle_type: 'Motorcycle',
      violation_type: 'No Helmet',
      location: 'Hadapsar',
      timestamp: '2026-09-01T10:08:30',
      priority: 'Medium',
      severity: 'Medium',
      fine: 1000,
      status: 'Pending',
      description: 'Motorcycle rider without helmet',
      camera_id: 'CAM-011',
      category: 'Medium',
      helmet_required: true,
      rider_count: 1
    },
    {
      id: 12,
      plate: 'MH14XZ7890',
      vehicle_type: 'Motorcycle',
      violation_type: 'No Helmet',
      location: 'Camp',
      timestamp: '2026-09-01T10:06:15',
      priority: 'Medium',
      severity: 'Medium',
      fine: 1000,
      status: 'Pending',
      description: 'Motorcycle rider without helmet',
      camera_id: 'CAM-012',
      category: 'Medium',
      helmet_required: true,
      rider_count: 2
    },
    {
      id: 13,
      plate: 'MH15AB2345',
      vehicle_type: 'Motorcycle',
      violation_type: 'No Helmet',
      location: 'Swargate',
      timestamp: '2026-09-01T10:04:00',
      priority: 'Medium',
      severity: 'Medium',
      fine: 1000,
      status: 'Pending',
      description: 'Motorcycle rider without helmet',
      camera_id: 'CAM-013',
      category: 'Medium',
      helmet_required: true,
      rider_count: 1
    },

    // LOW PRIORITY - General
    {
      id: 14,
      plate: 'MH12CD6789',
      vehicle_type: 'Car',
      violation_type: 'No Seatbelt',
      location: 'Koregaon Park',
      timestamp: '2026-09-01T10:02:00',
      priority: 'Low',
      severity: 'Low',
      fine: 500,
      status: 'Resolved',
      description: 'Driver without seatbelt',
      camera_id: 'CAM-014',
      category: 'Low'
    }
  ]

  // =========================================================
  // DEMO DATA - CHALLANS (High Priority)
  // =========================================================

  const demoChallans = [
    {
      id: 1,
      challan_number: 'CHN-2026-004',
      plate: 'MH15EF3456',
      violation: 'Over Speeding',
      amount: 2000,
      status: 'Unpaid',
      issued_date: '2026-09-01',
      due_date: '2026-09-10',
      payment_status: 'Pending',
      location: 'Shivajinagar',
      priority: 'High',
      vehicle_type: 'Car'
    },
    {
      id: 2,
      challan_number: 'CHN-2026-005',
      plate: 'MH14GH7890',
      violation: 'Signal Jump',
      amount: 1500,
      status: 'Unpaid',
      issued_date: '2026-09-01',
      due_date: '2026-09-10',
      payment_status: 'Pending',
      location: 'Aundh Bridge',
      priority: 'High',
      vehicle_type: 'Bike'
    },
    {
      id: 3,
      challan_number: 'CHN-2026-008',
      plate: 'MH12NO3456',
      violation: 'Overloading',
      amount: 5000,
      status: 'Unpaid',
      issued_date: '2026-09-01',
      due_date: '2026-09-12',
      payment_status: 'Pending',
      location: 'Viman Nagar',
      priority: 'High',
      vehicle_type: 'Truck'
    }
  ]

  // =========================================================
  // DEMO DATA - DOCUMENT VERIFICATION (High Priority)
  // =========================================================

  const demoDocuments = [
    {
      id: 1,
      plate: 'MH12JK2345',
      vehicle_type: 'Car',
      document_type: 'Registration + Insurance',
      status: 'Expired',
      expiry_date: '2026-08-15',
      issued_date: '2024-08-15',
      owner: 'Amit Kumar',
      priority: 'High',
      camera_id: 'CAM-006',
      location: 'Pune Station',
      action_required: 'Renew immediately'
    },
    {
      id: 2,
      plate: 'MH14LM6789',
      vehicle_type: 'Car',
      document_type: 'Driving License',
      status: 'Invalid',
      expiry_date: '2026-07-20',
      issued_date: '2021-07-20',
      owner: 'Sneha Reddy',
      priority: 'High',
      camera_id: 'CAM-007',
      location: 'Kharadi Bypass',
      action_required: 'Visit RTO for renewal'
    },
    {
      id: 3,
      plate: 'MH15PQ2345',
      vehicle_type: 'Truck',
      document_type: 'Fitness Certificate',
      status: 'Expired',
      expiry_date: '2026-08-01',
      issued_date: '2025-08-01',
      owner: 'Mohan Transport',
      priority: 'High',
      camera_id: 'CAM-008',
      location: 'Hadapsar',
      action_required: 'Vehicle fitness test required'
    }
  ]

  // =========================================================
  // DEMO DATA - NO HELMET (Medium Priority)
  // =========================================================

  const demoNoHelmet = [
    {
      id: 1,
      plate: 'MH15RS2345',
      vehicle_type: 'Motorcycle',
      location: 'Koregaon Park',
      timestamp: '2026-09-01T10:12:20',
      rider_count: 1,
      helmet_required: true,
      fine: 1000,
      camera_id: 'CAM-009',
      priority: 'Medium',
      status: 'Pending'
    },
    {
      id: 2,
      plate: 'MH14TU6789',
      vehicle_type: 'Motorcycle',
      location: 'Deccan',
      timestamp: '2026-09-01T10:10:00',
      rider_count: 2,
      helmet_required: true,
      fine: 1000,
      camera_id: 'CAM-010',
      priority: 'Medium',
      status: 'Pending'
    },
    {
      id: 3,
      plate: 'MH12VW3456',
      vehicle_type: 'Motorcycle',
      location: 'Hadapsar',
      timestamp: '2026-09-01T10:08:30',
      rider_count: 1,
      helmet_required: true,
      fine: 1000,
      camera_id: 'CAM-011',
      priority: 'Medium',
      status: 'Pending'
    },
    {
      id: 4,
      plate: 'MH14XZ7890',
      vehicle_type: 'Motorcycle',
      location: 'Camp',
      timestamp: '2026-09-01T10:06:15',
      rider_count: 2,
      helmet_required: true,
      fine: 1000,
      camera_id: 'CAM-012',
      priority: 'Medium',
      status: 'Pending'
    },
    {
      id: 5,
      plate: 'MH15AB2345',
      vehicle_type: 'Motorcycle',
      location: 'Swargate',
      timestamp: '2026-09-01T10:04:00',
      rider_count: 1,
      helmet_required: true,
      fine: 1000,
      camera_id: 'CAM-013',
      priority: 'Medium',
      status: 'Pending'
    }
  ]

  // =========================================================
  // FETCH DATA
  // =========================================================

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      setViolations(demoViolations)
      setChallans(demoChallans)
      setDocuments(demoDocuments)
      setNoHelmet(demoNoHelmet)
      
      setAnalytics({
        total_violations: demoViolations.length,
        critical_count: demoViolations.filter(v => v.priority === 'Critical').length,
        high_count: demoViolations.filter(v => v.priority === 'High').length,
        medium_count: demoViolations.filter(v => v.priority === 'Medium').length,
        low_count: demoViolations.filter(v => v.priority === 'Low').length,
        total_challans: demoChallans.length,
        total_fines: demoChallans.reduce((sum, c) => sum + c.amount, 0) + demoNoHelmet.reduce((sum, n) => sum + n.fine, 0),
        no_helmet_count: demoNoHelmet.length,
        document_verification: demoDocuments.length
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    setGenerating(true)
    await fetchData()
    setTimeout(() => setGenerating(false), 1500)
  }

  // Filter violations based on priority
  const filteredViolations = violations.filter(v => {
    if (searchTerm && !v.plate.includes(searchTerm.toUpperCase())) return false
    if (priorityFilter !== 'all' && v.priority.toLowerCase() !== priorityFilter) return false
    return true
  })

  const getPriorityBadge = (priority) => {
    const colors = {
      Critical: 'badge-danger',
      High: 'badge-warning',
      Medium: 'badge-primary',
      Low: 'badge-success'
    }
    return colors[priority] || 'badge-gray'
  }

  const getStatusBadge = (status) => {
    const colors = {
      Paid: 'badge-success',
      Unpaid: 'badge-danger',
      Pending: 'badge-warning',
      Overdue: 'badge-danger',
      Completed: 'badge-success',
      Active: 'badge-warning',
      Resolved: 'badge-success',
      Expired: 'badge-danger',
      Invalid: 'badge-danger'
    }
    return colors[status] || 'badge-gray'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Violations</h1>
          <p className="text-sm text-gray-400 mt-1">
            Critical alerts, Challans, Document Verification & No Helmet reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="btn-primary flex items-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Priority Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4 text-center border-l-4 border-danger">
          <p className="text-xs text-gray-400">Critical</p>
          <p className="text-2xl font-bold text-danger">{analytics?.critical_count || 0}</p>
          <p className="text-xs text-gray-500">Hit & Run, Stolen</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-warning">
          <p className="text-xs text-gray-400">High Priority</p>
          <p className="text-2xl font-bold text-warning">{analytics?.high_count || 0}</p>
          <p className="text-xs text-gray-500">Challans + Documents</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-primary">
          <p className="text-xs text-gray-400">Medium Priority</p>
          <p className="text-2xl font-bold text-primary">{analytics?.medium_count || 0}</p>
          <p className="text-xs text-gray-500">No Helmet</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-success">
          <p className="text-xs text-gray-400">Low Priority</p>
          <p className="text-2xl font-bold text-success">{analytics?.low_count || 0}</p>
          <p className="text-xs text-gray-500">General</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-secondary">
          <p className="text-xs text-gray-400">Total Fines</p>
          <p className="text-2xl font-bold text-secondary">₹{(analytics?.total_fines || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Priority Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setPriorityFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            priorityFilter === 'all'
              ? 'bg-primary text-white border-primary'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setPriorityFilter('critical')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            priorityFilter === 'critical'
              ? 'bg-danger text-white border-danger'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          🔴 Critical
        </button>
        <button
          onClick={() => setPriorityFilter('high')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            priorityFilter === 'high'
              ? 'bg-warning text-white border-warning'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          🟡 High (Challans + Documents)
        </button>
        <button
          onClick={() => setPriorityFilter('medium')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            priorityFilter === 'medium'
              ? 'bg-primary text-white border-primary'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          🟣 Medium (No Helmet)
        </button>
        <button
          onClick={() => setPriorityFilter('low')}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            priorityFilter === 'low'
              ? 'bg-success text-white border-success'
              : 'bg-dark-hover text-gray-400 border-dark-border hover:text-white'
          }`}
        >
          🟢 Low
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedReportType('all')}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
              selectedReportType === 'all'
                ? 'bg-primary text-white'
                : 'bg-dark-hover text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            All Reports
          </button>
          <button
            onClick={() => setSelectedReportType('critical')}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
              selectedReportType === 'critical'
                ? 'bg-danger text-white'
                : 'bg-dark-hover text-gray-400 hover:text-white'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            Critical
          </button>
          <button
            onClick={() => setSelectedReportType('challans')}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
              selectedReportType === 'challans'
                ? 'bg-warning text-white'
                : 'bg-dark-hover text-gray-400 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            Challans
          </button>
          <button
            onClick={() => setSelectedReportType('documents')}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
              selectedReportType === 'documents'
                ? 'bg-warning text-white'
                : 'bg-dark-hover text-gray-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Document Verification
          </button>
          <button
            onClick={() => setSelectedReportType('nohelmet')}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
              selectedReportType === 'nohelmet'
                ? 'bg-primary text-white'
                : 'bg-dark-hover text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            No Helmet
          </button>
        </div>
      </div>

      {/* =========================================================
          CRITICAL ALERTS
      ========================================================= */}
      {(selectedReportType === 'all' || selectedReportType === 'critical') && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-danger uppercase tracking-wider flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              Critical Alerts
            </h3>
            <span className="text-xs text-gray-500">{violations.filter(v => v.priority === 'Critical').length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-hover/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Violation</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filteredViolations
                  .filter(v => v.priority === 'Critical')
                  .slice(0, 10)
                  .map((violation) => (
                    <tr key={violation.id} className="hover:bg-dark-hover/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-danger">{violation.plate}</td>
                      <td className="px-4 py-3 text-gray-300">{violation.violation_type}</td>
                      <td className="px-4 py-3 text-gray-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        {violation.location}
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-danger">Critical</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${getStatusBadge(violation.status)}`}>
                          {violation.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="btn-danger text-xs py-1 px-3">View Alert</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          HIGH PRIORITY - CHALLANS
      ========================================================= */}
      {(selectedReportType === 'all' || selectedReportType === 'challans') && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-warning uppercase tracking-wider flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" />
              Challans Issued
            </h3>
            <span className="text-xs text-gray-500">{challans.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-hover/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Challan No.</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Violation</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {challans.map((challan) => (
                  <tr key={challan.id} className="hover:bg-dark-hover/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-primary">{challan.challan_number}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">{challan.plate}</td>
                    <td className="px-4 py-3 text-gray-300">{challan.violation}</td>
                    <td className="px-4 py-3 text-white font-bold">₹{challan.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getStatusBadge(challan.status)}`}>
                        {challan.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{challan.due_date}</td>
                    <td className="px-4 py-3">
                      <button className="btn-primary text-xs py-1 px-3">Pay Now</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          HIGH PRIORITY - DOCUMENT VERIFICATION
      ========================================================= */}
      {(selectedReportType === 'all' || selectedReportType === 'documents') && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-warning uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Document Verification Required
            </h3>
            <span className="text-xs text-gray-500">{documents.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-hover/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Document Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Expiry</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Owner</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-dark-hover/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-white">{doc.plate}</td>
                    <td className="px-4 py-3 text-gray-300">{doc.document_type}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getStatusBadge(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{doc.expiry_date}</td>
                    <td className="px-4 py-3 text-gray-300">{doc.owner}</td>
                    <td className="px-4 py-3">
                      <button className="btn-warning text-xs py-1 px-3">Verify</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          MEDIUM PRIORITY - NO HELMET
      ========================================================= */}
      {(selectedReportType === 'all' || selectedReportType === 'nohelmet') && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4" />
              No Helmet Violations
            </h3>
            <span className="text-xs text-gray-500">{noHelmet.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-hover/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Riders</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fine</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {noHelmet.map((violation) => (
                  <tr key={violation.id} className="hover:bg-dark-hover/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-primary">{violation.plate}</td>
                    <td className="px-4 py-3 text-gray-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      {violation.location}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-white">{violation.rider_count}</span>
                    </td>
                    <td className="px-4 py-3 text-white font-bold">₹{violation.fine.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getStatusBadge(violation.status)}`}>
                        {violation.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="btn-primary text-xs py-1 px-3">Issue Challan</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="flex flex-wrap gap-3">
        <button className="btn-secondary flex items-center gap-2">
          <File className="w-4 h-4" />
          Export PDF
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export CSV
        </button>
        <button className="btn-secondary flex items-center gap-2" onClick={() => window.print()}>
          <Printer className="w-4 h-4" />
          Print Report
        </button>
      </div>
    </div>
  )
}

export default Reports