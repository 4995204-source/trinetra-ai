import React, { useState, useEffect } from 'react'
import {
  Activity,
  Cpu,
  HardDrive,
  Database,
  Server,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Shield,
  RefreshCw,
  Thermometer,
  TrendingUp,
  Camera,
  Wifi,
  WifiOff,
  Bell,
  Send,
  FileText,
  Download,
  Printer,
  AlertTriangle,
  BarChart3
} from 'lucide-react'

function SystemHealth() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [systemStats, setSystemStats] = useState({
    cpu: 45,
    memory: 62,
    gpu: 78,
    fps: 24,
    latency: 45,
    temperature: 42
  })
  const [cameraIssues, setCameraIssues] = useState([])
  const [hardwareIssues, setHardwareIssues] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [issueReports, setIssueReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  // Simulate hardware issues
  const mockHardwareIssues = [
    {
      id: 1,
      component: 'GPU',
      issue: 'Temperature above 80°C',
      severity: 'Critical',
      status: 'Active',
      detected: '2026-09-01 10:30:00',
      recommendation: 'Check cooling system, reduce load',
      department: 'IT Hardware'
    },
    {
      id: 2,
      component: 'CPU',
      issue: 'High usage (95%)',
      severity: 'High',
      status: 'Active',
      detected: '2026-09-01 10:15:00',
      recommendation: 'Check background processes, reduce workload',
      department: 'IT Operations'
    },
    {
      id: 3,
      component: 'Memory',
      issue: 'Memory leak detected',
      severity: 'Medium',
      status: 'Resolved',
      detected: '2026-09-01 09:45:00',
      recommendation: 'Restart service, monitor memory usage',
      department: 'Development Team'
    },
    {
      id: 4,
      component: 'Camera CAM-003',
      issue: 'Connection Lost',
      severity: 'High',
      status: 'Active',
      detected: '2026-09-01 09:30:00',
      recommendation: 'Check network cable, restart camera',
      department: 'Network Team'
    },
    {
      id: 5,
      component: 'Storage',
      issue: 'Disk space running low (15% free)',
      severity: 'Medium',
      status: 'Active',
      detected: '2026-09-01 09:00:00',
      recommendation: 'Clean up logs, archive old data',
      department: 'IT Storage'
    }
  ]

  // Camera specific issues
  const mockCameraIssues = [
    { 
      id: 1,
      camera: 'CAM-003', 
      issue: 'Connection Lost', 
      severity: 'High', 
      time: '2 min ago',
      status: 'Active',
      location: 'Baner Road',
      department: 'Network Team'
    },
    { 
      id: 2,
      camera: 'CAM-005', 
      issue: 'Low Frame Rate', 
      severity: 'Medium', 
      time: '5 min ago',
      status: 'Active',
      location: 'Aundh Bridge',
      department: 'IT Operations'
    },
    { 
      id: 3,
      camera: 'CAM-008', 
      issue: 'No Signal', 
      severity: 'Critical', 
      time: '10 min ago',
      status: 'Active',
      location: 'Viman Nagar',
      department: 'Network Team'
    }
  ]

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
    const interval = setInterval(updateTime, 1000)
    
    // Load mock issues
    setHardwareIssues(mockHardwareIssues)
    setCameraIssues(mockCameraIssues)
    
    // Generate initial reports
    generateInitialReports()
    
    return () => clearInterval(interval)
  }, [])

  const generateInitialReports = () => {
    const reports = mockHardwareIssues.map(issue => ({
      id: issue.id,
      type: 'Hardware Issue Report',
      component: issue.component,
      issue: issue.issue,
      severity: issue.severity,
      status: issue.status,
      detected: issue.detected,
      recommendation: issue.recommendation,
      department: issue.department,
      generated_at: new Date().toISOString(),
      report_number: `RPT-${String(issue.id).padStart(4, '0')}`,
      actions_taken: issue.status === 'Resolved' ? 'Restarted service, monitored' : 'Under investigation'
    }))

    const cameraReports = mockCameraIssues.map(issue => ({
      id: `CAM-${issue.id}`,
      type: 'Camera Issue Report',
      component: issue.camera,
      issue: issue.issue,
      severity: issue.severity,
      status: issue.status,
      detected: issue.time,
      recommendation: 'Check network connectivity',
      department: issue.department,
      generated_at: new Date().toISOString(),
      report_number: `RPT-CAM-${String(issue.id).padStart(4, '0')}`,
      actions_taken: 'Investigation ongoing'
    }))

    setIssueReports([...reports, ...cameraReports])
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setSystemStats({
      cpu: Math.floor(Math.random() * 40 + 30),
      memory: Math.floor(Math.random() * 30 + 50),
      gpu: Math.floor(Math.random() * 50 + 40),
      fps: Math.floor(Math.random() * 15 + 15),
      latency: Math.floor(Math.random() * 50 + 20),
      temperature: Math.floor(Math.random() * 20 + 35)
    })
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const handleNotifyDepartment = (issue) => {
    setSelectedDepartment(issue.department || 'IT Department')
    setNotificationMessage(`⚠️ ALERT: ${issue.component} has ${issue.issue}. Severity: ${issue.severity}. Please investigate immediately.`)
    setShowNotification(true)
    // Generate report automatically
    const newReport = {
      id: `RPT-${Date.now()}`,
      type: 'System Alert Report',
      component: issue.component,
      issue: issue.issue,
      severity: issue.severity,
      status: 'Active',
      detected: new Date().toLocaleString(),
      recommendation: issue.recommendation || 'Investigate and resolve immediately',
      department: issue.department || 'IT Department',
      generated_at: new Date().toISOString(),
      report_number: `RPT-${String(issueReports.length + 1).padStart(4, '0')}`,
      actions_taken: 'Alert sent, investigation started'
    }
    setIssueReports([newReport, ...issueReports])
    setTimeout(() => setShowNotification(false), 5000)
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setShowReportModal(true)
  }

  const handleDownloadReport = (report) => {
    const reportData = {
      report_number: report.report_number,
      type: report.type,
      component: report.component,
      issue: report.issue,
      severity: report.severity,
      status: report.status,
      detected: report.detected,
      recommendation: report.recommendation,
      department: report.department,
      generated_at: report.generated_at,
      actions_taken: report.actions_taken || 'Under review'
    }

    const blob = new Blob(
      [JSON.stringify(reportData, null, 2)],
      { type: 'application/json' }
    )
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${report.report_number}_system_report.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity) => {
    const colors = {
      Critical: 'text-danger border-danger',
      High: 'text-danger border-danger/50',
      Medium: 'text-warning border-warning',
      Low: 'text-primary border-primary'
    }
    return colors[severity] || 'text-gray-400'
  }

  const getStatusBadge = (status) => {
    const colors = {
      Active: 'badge-danger',
      Resolved: 'badge-success',
      Pending: 'badge-warning',
      UnderInvestigation: 'badge-warning'
    }
    return colors[status] || 'badge-gray'
  }

  const filteredReports = issueReports.filter(report => {
    if (filterStatus === 'all') return true
    return report.status.toLowerCase() === filterStatus
  })

  const stats = {
    total: issueReports.length,
    active: issueReports.filter(r => r.status === 'Active').length,
    resolved: issueReports.filter(r => r.status === 'Resolved').length,
    critical: issueReports.filter(r => r.severity === 'Critical').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">System Health</h1>
          <p className="text-sm text-gray-400 mt-1">
            Monitor system status and hardware components with automatic reporting
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="status-dot online" />
            <span>System Online</span>
            <span className="font-mono text-primary ml-2">{currentTime}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-gray-400">Total Reports</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-danger">
          <p className="text-xs text-gray-400">Active Issues</p>
          <p className="text-2xl font-bold text-danger">{stats.active}</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-success">
          <p className="text-xs text-gray-400">Resolved</p>
          <p className="text-2xl font-bold text-success">{stats.resolved}</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-warning">
          <p className="text-xs text-gray-400">Critical</p>
          <p className="text-2xl font-bold text-warning">{stats.critical}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-border">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'reports'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Reports ({issueReports.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <>
          {/* System Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">System Uptime</p>
                <span className="text-2xl">🚀</span>
              </div>
              <p className="text-2xl font-bold text-white mt-2">99.8%</p>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                All systems operational
              </p>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Active Services</p>
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-2xl font-bold text-success mt-2">6 / 6</p>
              <p className="text-xs text-gray-400 mt-1">All services online</p>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Hardware Issues</p>
                <span className="text-2xl">🔧</span>
              </div>
              <p className="text-2xl font-bold text-danger mt-2">{stats.active}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.active} active issues</p>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Reports Generated</p>
                <span className="text-2xl">📄</span>
              </div>
              <p className="text-2xl font-bold text-secondary mt-2">{stats.total}</p>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                Auto-reporting active
              </p>
            </div>
          </div>

          {/* Resource Usage */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Resource Usage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">CPU</span>
                  </div>
                  <span className="text-sm font-bold text-white">{systemStats.cpu}%</span>
                </div>
                <div className="h-2 bg-dark-hover rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      systemStats.cpu < 50 ? 'bg-success' :
                      systemStats.cpu < 75 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${systemStats.cpu}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Intel Xeon E5-2680 v4</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium text-white">Memory</span>
                  </div>
                  <span className="text-sm font-bold text-white">{systemStats.memory}%</span>
                </div>
                <div className="h-2 bg-dark-hover rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      systemStats.memory < 50 ? 'bg-success' :
                      systemStats.memory < 75 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${systemStats.memory}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">32 GB DDR4</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-white">GPU</span>
                  </div>
                  <span className="text-sm font-bold text-white">{systemStats.gpu}%</span>
                </div>
                <div className="h-2 bg-dark-hover rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      systemStats.gpu < 50 ? 'bg-success' :
                      systemStats.gpu < 75 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${systemStats.gpu}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">NVIDIA RTX 3050</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-white">Detection FPS</span>
                  </div>
                  <span className="text-sm font-bold text-white">{systemStats.fps}</span>
                </div>
                <div className="h-2 bg-dark-hover rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      systemStats.fps > 25 ? 'bg-success' :
                      systemStats.fps > 15 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${(systemStats.fps / 30) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Real-time processing</p>
              </div>
            </div>
          </div>

          {/* Camera Issues Section */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-danger" />
                Camera Issues Detected
              </h3>
              <span className="text-xs text-danger">⚠️ {cameraIssues.length} issues</span>
            </div>

            <div className="space-y-3">
              {cameraIssues.map((issue) => (
                <div key={issue.id} className={`glass-card p-4 border-l-4 ${getSeverityColor(issue.severity)}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white">{issue.camera}</span>
                        <span className={`badge ${getStatusBadge(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span className={`badge ${
                          issue.severity === 'Critical' ? 'badge-danger' :
                          issue.severity === 'High' ? 'badge-warning' :
                          'badge-primary'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{issue.issue}</p>
                      <p className="text-xs text-gray-500 mt-1">Location: {issue.location} • Detected: {issue.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleNotifyDepartment(issue)}
                        className="btn-primary text-xs py-1 px-3 flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Notify
                      </button>
                      <button className="btn-secondary text-xs py-1 px-3">
                        <FileText className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Reports Tab
        <div className="space-y-4">
          {/* Report Filters */}
          <div className="glass-card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="select-field w-40"
              >
                <option value="all">All Reports</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="pending">Pending</option>
              </select>
              <button className="btn-secondary flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Export All
              </button>
              <button className="btn-secondary flex items-center gap-2 text-sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>

          {/* Reports Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-hover/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Report #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Component</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Issue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Detected</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-dark-hover/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-primary">{report.report_number}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {report.type.includes('Camera') ? (
                            <Camera className="w-4 h-4 text-secondary" />
                          ) : (
                            <Cpu className="w-4 h-4 text-primary" />
                          )}
                          <span className="text-sm font-medium text-white">{report.component}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-300">{report.issue}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${
                          report.severity === 'Critical' ? 'badge-danger' :
                          report.severity === 'High' ? 'badge-warning' :
                          'badge-primary'
                        }`}>
                          {report.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{report.department}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{report.detected}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewReport(report)}
                            className="p-1.5 hover:bg-primary/20 rounded-lg transition-colors"
                            title="View Report"
                          >
                            <FileText className="w-4 h-4 text-primary" />
                          </button>
                          <button
                            onClick={() => handleDownloadReport(report)}
                            className="p-1.5 hover:bg-secondary/20 rounded-lg transition-colors"
                            title="Download Report"
                          >
                            <Download className="w-4 h-4 text-secondary" />
                          </button>
                          {report.status === 'Active' && (
                            <button
                              onClick={() => handleNotifyDepartment(report)}
                              className="p-1.5 hover:bg-warning/20 rounded-lg transition-colors"
                              title="Notify Department"
                            >
                              <Bell className="w-4 h-4 text-warning" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination/Summary */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filteredReports.length} reports</span>
            <span>Last updated: {currentTime}</span>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 glass-card p-4 border-success border-l-4 max-w-md animate-slide-in">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-success">Notification Sent</p>
              <p className="text-sm text-gray-300">To: {selectedDepartment}</p>
              <p className="text-xs text-gray-400 mt-1">{notificationMessage}</p>
              <p className="text-xs text-success mt-2">Report automatically generated</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <div>
                <h2 className="text-xl font-bold text-white">Report Details</h2>
                <p className="text-sm text-gray-400">{selectedReport.report_number}</p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="glass-card p-4">
                  <p className="text-xs text-gray-400">Component</p>
                  <p className="text-sm font-semibold text-white mt-1">{selectedReport.component}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-gray-400">Severity</p>
                  <p className={`text-sm font-semibold mt-1 ${
                    selectedReport.severity === 'Critical' ? 'text-danger' :
                    selectedReport.severity === 'High' ? 'text-warning' :
                    'text-primary'
                  }`}>
                    {selectedReport.severity}
                  </p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-sm font-semibold text-white mt-1">{selectedReport.status}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-gray-400">Department</p>
                  <p className="text-sm font-semibold text-white mt-1">{selectedReport.department}</p>
                </div>
              </div>

              <div className="glass-card p-4 mb-4">
                <p className="text-xs text-gray-400">Issue Description</p>
                <p className="text-sm text-white mt-1">{selectedReport.issue}</p>
              </div>

              <div className="glass-card p-4 mb-4">
                <p className="text-xs text-gray-400">Recommendation</p>
                <p className="text-sm text-white mt-1">{selectedReport.recommendation}</p>
              </div>

              <div className="glass-card p-4">
                <p className="text-xs text-gray-400">Actions Taken</p>
                <p className="text-sm text-white mt-1">{selectedReport.actions_taken || 'Under investigation'}</p>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-dark-border">
                <button
                  onClick={() => handleDownloadReport(selectedReport)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
                <button
                  onClick={() => {
                    handleNotifyDepartment(selectedReport)
                    setShowReportModal(false)
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Notify Department
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SystemHealth