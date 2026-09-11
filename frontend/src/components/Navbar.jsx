import React, { useState, useEffect } from 'react'
import { Bell, User, ChevronDown, Wifi, Database, Cpu } from 'lucide-react'

function Navbar() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-dark-card/80 backdrop-blur-sm border-b border-dark-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="status-dot online" />
          <span className="text-sm text-gray-400">System Online</span>
        </div>
        <div className="h-6 w-px bg-dark-border" />
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <Wifi className="w-4 h-4 text-success" />
          <span>4 Cameras</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <Database className="w-4 h-4 text-primary" />
          <span>Connected</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <Cpu className="w-4 h-4 text-secondary" />
          <span>AI Active</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-300 font-mono">{currentTime}</span>
        <div className="relative">
          <button className="relative p-2 rounded-lg hover:bg-dark-hover transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger rounded-full text-[10px] font-bold flex items-center justify-center text-white">3</span>
          </button>
        </div>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-dark-hover p-2 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-gray-500">Police Dept.</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </header>
  )
}

export default Navbar