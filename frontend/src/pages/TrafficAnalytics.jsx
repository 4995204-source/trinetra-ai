import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Car, 
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts'

const TrafficAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h')
  const [selectedCamera, setSelectedCamera] = useState('all')

  // Traffic data for different periods
  const trafficData = {
    '1h': [
      { time: '14:00', vehicles: 120, violations: 5, avgSpeed: 45 },
      { time: '14:15', vehicles: 145, violations: 8, avgSpeed: 48 },
      { time: '14:30', vehicles: 132, violations: 3, avgSpeed: 42 },
      { time: '14:45', vehicles: 160, violations: 6, avgSpeed: 50 },
      { time: '15:00', vehicles: 155, violations: 4, avgSpeed: 47 },
    ],
    '24h': [
      { time: '00:00', vehicles: 120, violations: 5, avgSpeed: 40 },
      { time: '04:00', vehicles: 80, violations: 3, avgSpeed: 35 },
      { time: '08:00', vehicles: 450, violations: 15, avgSpeed: 55 },
      { time: '12:00', vehicles: 380, violations: 10, avgSpeed: 50 },
      { time: '16:00', vehicles: 520, violations: 18, avgSpeed: 58 },
      { time: '20:00', vehicles: 300, violations: 8, avgSpeed: 45 },
    ],
    '7d': [
      { time: 'Mon', vehicles: 1250, violations: 45, avgSpeed: 50 },
      { time: 'Tue', vehicles: 1350, violations: 52, avgSpeed: 52 },
      { time: 'Wed', vehicles: 1420, violations: 48, avgSpeed: 49 },
      { time: 'Thu', vehicles: 1380, violations: 55, avgSpeed: 51 },
      { time: 'Fri', vehicles: 1550, violations: 62, avgSpeed: 54 },
      { time: 'Sat', vehicles: 980, violations: 35, avgSpeed: 45 },
      { time: 'Sun', vehicles: 850, violations: 28, avgSpeed: 42 },
    ],
    '30d': [
      { time: 'Week 1', vehicles: 8200, violations: 320, avgSpeed: 50 },
      { time: 'Week 2', vehicles: 8900, violations: 350, avgSpeed: 52 },
      { time: 'Week 3', vehicles: 8600, violations: 340, avgSpeed: 51 },
      { time: 'Week 4', vehicles: 9200, violations: 380, avgSpeed: 53 },
    ]
  }

  // Vehicle type distribution
  const vehicleTypes = [
    { name: 'Sedan', value: 45, color: '#00B4FF' },
    { name: 'SUV', value: 30, color: '#00E5FF' },
    { name: 'Hatchback', value: 15, color: '#FFC107' },
    { name: 'Truck', value: 7, color: '#FF1744' },
    { name: 'Motorcycle', value: 3, color: '#00E676' },
  ]

  // Peak hours data
  const peakHours = [
    { time: '08:00 - 10:00', traffic: 'High', vehicles: '850', congestion: 'Severe' },
    { time: '12:00 - 14:00', traffic: 'Medium', vehicles: '520', congestion: 'Moderate' },
    { time: '17:00 - 19:00', traffic: 'Very High', vehicles: '980', congestion: 'Critical' },
    { time: '22:00 - 06:00', traffic: 'Low', vehicles: '150', congestion: 'Low' },
  ]

  // Camera-wise statistics
  const cameraStats = [
    { name: 'Junction 12', vehicles: 2450, violations: 45, avgSpeed: 48 },
    { name: 'Main Street', vehicles: 1890, violations: 32, avgSpeed: 45 },
    { name: 'Highway 7', vehicles: 3200, violations: 58, avgSpeed: 62 },
    { name: 'Airport Road', vehicles: 1450, violations: 25, avgSpeed: 55 },
    { name: 'Central Station', vehicles: 980, violations: 15, avgSpeed: 42 },
  ]

  const kpis = [
    { label: 'Total Vehicles', value: '12,847', icon: Car, trend: '+8.5%', trendUp: true, color: 'primary' },
    { label: 'Avg Speed', value: '52 km/h', icon: Activity, trend: '-2.1%', trendUp: false, color: 'success' },
    { label: 'Violations', value: '143', icon: AlertTriangle, trend: '+12.3%', trendUp: true, color: 'danger' },
    { label: 'Peak Hour', value: '17:00 - 19:00', icon: Clock, trend: 'Critical', trendUp: true, color: 'warning' },
  ]

  const currentData = trafficData[selectedPeriod]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Traffic Analytics</h2>
          <p className="text-sm text-gray-500">Comprehensive traffic flow analysis and insights</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">Period:</span>
          </div>
          <div className="flex gap-2">
            {['1h', '24h', '7d', '30d'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-dark-hover text-gray-400 hover:text-white'
                }`}
              >
                {period === '1h' ? 'Last Hour' : period === '24h' ? 'Last 24 Hours' : period === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>
          
          <div className="ml-auto">
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Cameras</option>
              <option value="Junction 12">Junction 12</option>
              <option value="Main Street">Main Street</option>
              <option value="Highway 7">Highway 7</option>
              <option value="Airport Road">Airport Road</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <div key={index} className="glass-card p-6 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">{kpi.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{kpi.value}</p>
                  <div className={`flex items-center gap-1 mt-2 ${kpi.trendUp ? 'text-success' : 'text-danger'}`}>
                    {kpi.trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span className="text-xs">{kpi.trend}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${
                  kpi.color === 'primary' ? 'text-primary bg-primary/10' :
                  kpi.color === 'success' ? 'text-success bg-success/10' :
                  kpi.color === 'danger' ? 'text-danger bg-danger/10' :
                  'text-warning bg-warning/10'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Flow Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Traffic Flow</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <TrendingUp className="w-4 h-4 text-success" />
              Vehicles over time
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="time" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="vehicles" stroke="#00B4FF" fill="#00B4FF" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Violations Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Violations</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertTriangle className="w-4 h-4 text-danger" />
              Traffic violations
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="time" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="violations" fill="#FF1744" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Speed Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Average Speed</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Activity className="w-4 h-4 text-primary" />
              Speed trends
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="time" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="avgSpeed" stroke="#00E5FF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Type Distribution */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Vehicle Type Distribution</h3>
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {vehicleTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {vehicleTypes.map((type) => (
              <div key={type.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                <span className="text-gray-400">{type.name}</span>
                <span className="ml-auto font-medium">{type.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Peak Hours Analysis</h3>
          <div className="space-y-3">
            {peakHours.map((peak, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{peak.time}</p>
                    <p className="text-xs text-gray-500">{peak.vehicles} vehicles</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${
                    peak.traffic === 'Very High' ? 'badge-danger' :
                    peak.traffic === 'High' ? 'badge-warning' :
                    peak.traffic === 'Medium' ? 'badge-primary' :
                    'badge-success'
                  }`}>
                    {peak.traffic}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{peak.congestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Camera Statistics */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Camera Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Camera</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Vehicles</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Violations</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Avg Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {cameraStats.map((cam, index) => (
                  <tr key={index} className="hover:bg-dark-hover/30">
                    <td className="px-4 py-2 text-sm">{cam.name}</td>
                    <td className="px-4 py-2 text-sm text-primary">{cam.vehicles}</td>
                    <td className="px-4 py-2 text-sm text-danger">{cam.violations}</td>
                    <td className="px-4 py-2 text-sm">{cam.avgSpeed} km/h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrafficAnalytics