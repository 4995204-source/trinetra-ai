import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function TrafficChart({ data, title }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-3">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-lg font-bold text-white">{payload[0].value} vehicles</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B4FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00B4FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="label" stroke="#64748B" fontSize={12} />
            <YAxis stroke="#64748B" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#00B4FF" strokeWidth={2} fill="url(#trafficGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TrafficChart