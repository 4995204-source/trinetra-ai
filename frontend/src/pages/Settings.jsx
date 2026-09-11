import React, { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Camera, 
  Database, 
  Shield, 
  Save, 
  Activity,
  Globe,
  Lock,
  Key,
  Mail,
  Smartphone,
  AlertTriangle
} from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'TRINETRA AI',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    language: 'English',
    units: 'Metric',
    retentionPeriod: '30'
  })

  const [cameraSettings, setCameraSettings] = useState({
    defaultResolution: '1080p',
    frameRate: 30,
    detectionConfidence: 80,
    maxCameras: 500,
    autoReboot: true,
    motionDetection: true,
    nightVision: true,
    backupStorage: true,
    compressionQuality: 'Medium'
  })

  const [alertSettings, setAlertSettings] = useState({
    criticalAlerts: true,
    highAlerts: true,
    mediumAlerts: true,
    lowAlerts: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    soundAlerts: true,
    emailAddress: 'admin@trinetra.ai',
    smsNumber: '+91 98765 43210',
    quietHoursStart: '22:00',
    quietHoursEnd: '06:00'
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    maxLoginAttempts: '5',
    ipWhitelist: true,
    auditLogs: true,
    encryption: true
  })

  const [databaseSettings, setDatabaseSettings] = useState({
    host: 'localhost',
    port: '5432',
    database: 'trinetra_db',
    username: 'trinetra',
    maxConnections: '100',
    backupFrequency: '24 hours',
    backupRetention: '30 days',
    autoBackup: true,
    sslEnabled: true
  })

  const [userProfile, setUserProfile] = useState({
    name: 'Admin',
    email: 'admin@trinetra.ai',
    role: 'Administrator',
    phone: '+91 98765 43210'
  })

  const handleSave = (section) => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert(`${section} settings saved successfully!`)
    }, 1500)
  }

  const handleToggle = (setter, field) => {
    setter(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'camera', label: 'Camera', icon: Camera },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-sm text-gray-500">Configure system preferences and settings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-dark-hover text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">System Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={generalSettings.systemName}
                  onChange={(e) => setGeneralSettings({...generalSettings, systemName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Timezone</label>
                <select
                  className="input-field"
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date Format</label>
                <select
                  className="input-field"
                  value={generalSettings.dateFormat}
                  onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Language</label>
                <select
                  className="input-field"
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Units</label>
                <select
                  className="input-field"
                  value={generalSettings.units}
                  onChange={(e) => setGeneralSettings({...generalSettings, units: e.target.value})}
                >
                  <option value="Metric">Metric (km, km/h)</option>
                  <option value="Imperial">Imperial (miles, mph)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data Retention Period</label>
                <select
                  className="input-field"
                  value={generalSettings.retentionPeriod}
                  onChange={(e) => setGeneralSettings({...generalSettings, retentionPeriod: e.target.value})}
                >
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">365 days</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">User Profile</h3>
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <button className="text-xs text-primary hover:text-primary-dark">
                  Change Photo
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Role</label>
                  <input
                    type="text"
                    className="input-field"
                    value={userProfile.role}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              className="btn-primary"
              onClick={() => handleSave('General')}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Camera Settings */}
      {activeTab === 'camera' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Camera Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Default Resolution</label>
                <select
                  className="input-field"
                  value={cameraSettings.defaultResolution}
                  onChange={(e) => setCameraSettings({...cameraSettings, defaultResolution: e.target.value})}
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4K">4K</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Frame Rate</label>
                <select
                  className="input-field"
                  value={cameraSettings.frameRate}
                  onChange={(e) => setCameraSettings({...cameraSettings, frameRate: parseInt(e.target.value)})}
                >
                  <option value="15">15 fps</option>
                  <option value="25">25 fps</option>
                  <option value="30">30 fps</option>
                  <option value="60">60 fps</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Detection Confidence</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={cameraSettings.detectionConfidence}
                    onChange={(e) => setCameraSettings({...cameraSettings, detectionConfidence: parseInt(e.target.value)})}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-sm font-medium text-primary">{cameraSettings.detectionConfidence}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Cameras</label>
                <input
                  type="number"
                  className="input-field"
                  value={cameraSettings.maxCameras}
                  onChange={(e) => setCameraSettings({...cameraSettings, maxCameras: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Compression Quality</label>
                <select
                  className="input-field"
                  value={cameraSettings.compressionQuality}
                  onChange={(e) => setCameraSettings({...cameraSettings, compressionQuality: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Camera className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Auto Reboot</p>
                    <p className="text-xs text-gray-500">Automatically reboot cameras on failure</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setCameraSettings, 'autoReboot')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    cameraSettings.autoReboot ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cameraSettings.autoReboot ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-success" />
                  <div>
                    <p className="text-sm font-medium">Motion Detection</p>
                    <p className="text-xs text-gray-500">Enable motion detection alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setCameraSettings, 'motionDetection')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    cameraSettings.motionDetection ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cameraSettings.motionDetection ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-warning" />
                  <div>
                    <p className="text-sm font-medium">Night Vision</p>
                    <p className="text-xs text-gray-500">Enable night vision mode</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setCameraSettings, 'nightVision')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    cameraSettings.nightVision ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cameraSettings.nightVision ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-sm font-medium">Backup Storage</p>
                    <p className="text-xs text-gray-500">Automatically backup camera recordings</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setCameraSettings, 'backupStorage')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    cameraSettings.backupStorage ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cameraSettings.backupStorage ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              className="btn-primary"
              onClick={() => handleSave('Camera')}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Alert Settings */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Alert Preferences</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-danger" />
                  <div>
                    <p className="text-sm font-medium">Critical Alerts</p>
                    <p className="text-xs text-gray-500">Stolen vehicles, red light violations</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setAlertSettings, 'criticalAlerts')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    alertSettings.criticalAlerts ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    alertSettings.criticalAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <div>
                    <p className="text-sm font-medium">High Alerts</p>
                    <p className="text-xs text-gray-500">Speed violations, wrong way driving</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setAlertSettings, 'highAlerts')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    alertSettings.highAlerts ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    alertSettings.highAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Medium Alerts</p>
                    <p className="text-xs text-gray-500">No helmet, minor violations</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setAlertSettings, 'mediumAlerts')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    alertSettings.mediumAlerts ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    alertSettings.mediumAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-success" />
                  <div>
                    <p className="text-sm font-medium">Low Alerts</p>
                    <p className="text-xs text-gray-500">Informational notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setAlertSettings, 'lowAlerts')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    alertSettings.lowAlerts ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    alertSettings.lowAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Notifications</label>
                <input
                  type="email"
                  className="input-field"
                  value={alertSettings.emailAddress}
                  onChange={(e) => setAlertSettings({...alertSettings, emailAddress: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">SMS Notifications</label>
                <input
                  type="tel"
                  className="input-field"
                  value={alertSettings.smsNumber}
                  onChange={(e) => setAlertSettings({...alertSettings, smsNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Quiet Hours Start</label>
                <input
                  type="time"
                  className="input-field"
                  value={alertSettings.quietHoursStart}
                  onChange={(e) => setAlertSettings({...alertSettings, quietHoursStart: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Quiet Hours End</label>
                <input
                  type="time"
                  className="input-field"
                  value={alertSettings.quietHoursEnd}
                  onChange={(e) => setAlertSettings({...alertSettings, quietHoursEnd: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Email Notifications</span>
                </div>
                <button
                  onClick={() => handleToggle(setAlertSettings, 'emailNotifications')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    alertSettings.emailNotifications ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    alertSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">SMS Notifications</span>
                </div>
                <button
                  onClick={() => handleToggle(setAlertSettings, 'smsNotifications')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    alertSettings.smsNotifications ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    alertSettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium">Push Notifications</span>
                </div>
                <button
                  onClick={() => handleToggle(setAlertSettings, 'pushNotifications')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    alertSettings.pushNotifications ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    alertSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">Sound Alerts</span>
                </div>
                <button
                  onClick={() => handleToggle(setAlertSettings, 'soundAlerts')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    alertSettings.soundAlerts ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    alertSettings.soundAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              className="btn-primary"
              onClick={() => handleSave('Alert')}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Security Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Session Timeout (minutes)</label>
                <input
                  type="number"
                  className="input-field"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password Expiry (days)</label>
                <input
                  type="number"
                  className="input-field"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Login Attempts</label>
                <input
                  type="number"
                  className="input-field"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Require 2FA for all admin accounts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setSecuritySettings, 'twoFactorAuth')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    securitySettings.twoFactorAuth ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-success" />
                  <div>
                    <p className="text-sm font-medium">IP Whitelist</p>
                    <p className="text-xs text-gray-500">Restrict access to specific IP addresses</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setSecuritySettings, 'ipWhitelist')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    securitySettings.ipWhitelist ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    securitySettings.ipWhitelist ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-warning" />
                  <div>
                    <p className="text-sm font-medium">Audit Logs</p>
                    <p className="text-xs text-gray-500">Track all system activities</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setSecuritySettings, 'auditLogs')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    securitySettings.auditLogs ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    securitySettings.auditLogs ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-sm font-medium">Data Encryption</p>
                    <p className="text-xs text-gray-500">Encrypt sensitive data at rest</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setSecuritySettings, 'encryption')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    securitySettings.encryption ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    securitySettings.encryption ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              className="btn-primary"
              onClick={() => handleSave('Security')}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Database Settings */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Database Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Host</label>
                <input
                  type="text"
                  className="input-field"
                  value={databaseSettings.host}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, host: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Port</label>
                <input
                  type="text"
                  className="input-field"
                  value={databaseSettings.port}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, port: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Database Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={databaseSettings.database}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, database: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  className="input-field"
                  value={databaseSettings.username}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Connections</label>
                <input
                  type="number"
                  className="input-field"
                  value={databaseSettings.maxConnections}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, maxConnections: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Backup Frequency</label>
                <select
                  className="input-field"
                  value={databaseSettings.backupFrequency}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, backupFrequency: e.target.value})}
                >
                  <option value="1 hour">Every 1 hour</option>
                  <option value="6 hours">Every 6 hours</option>
                  <option value="12 hours">Every 12 hours</option>
                  <option value="24 hours">Every 24 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Backup Retention</label>
                <select
                  className="input-field"
                  value={databaseSettings.backupRetention}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, backupRetention: e.target.value})}
                >
                  <option value="7 days">7 days</option>
                  <option value="15 days">15 days</option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Auto Backup</p>
                    <p className="text-xs text-gray-500">Automatically backup database</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setDatabaseSettings, 'autoBackup')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    databaseSettings.autoBackup ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    databaseSettings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-success" />
                  <div>
                    <p className="text-sm font-medium">SSL Enabled</p>
                    <p className="text-xs text-gray-500">Use SSL for database connections</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setDatabaseSettings, 'sslEnabled')}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    databaseSettings.sslEnabled ? 'bg-primary' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    databaseSettings.sslEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              className="btn-primary"
              onClick={() => handleSave('Database')}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings