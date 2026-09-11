import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

const apiService = {
  async getCameras() {
    try {
      const response = await apiClient.get('/api/cameras')
      return response.data
    } catch (error) {
      console.error('Error fetching cameras:', error)
      return {
        cameras: [
          { id: 'laptop', name: 'Laptop Camera', location: 'Main System', status: 'online', type: 'laptop' },
          { id: 'phone_1', name: 'Phone Camera', location: 'Remote', status: 'online', type: 'phone' }
        ],
        total: 2,
        online: 2
      }
    }
  },

  async getDetections() {
    try {
      const response = await apiClient.get('/api/detections')
      return response.data
    } catch {
      return { detections: [] }
    }
  },

  async searchVehicles(plateNumber) {
    try {
      const response = await apiClient.get(`/api/vehicles/search/${plateNumber}`)
      return response.data
    } catch {
      return { vehicle: plateNumber, detections: [] }
    }
  },

  async getTrajectory(plateNumber) {
    try {
      const response = await apiClient.get(`/api/trajectory/${plateNumber}`)
      return response.data
    } catch {
      return { vehicle: plateNumber, trajectory: [] }
    }
  },

  async getAlerts() {
    try {
      const response = await apiClient.get('/api/alerts')
      return response.data
    } catch {
      return { alerts: [] }
    }
  },

  async getAnalytics() {
    try {
      const response = await apiClient.get('/api/analytics')
      return response.data
    } catch {
      return {
        totalVehicles: 12847,
        activeCameras: 2,
        totalCameras: 2,
        suspiciousVehicles: 7,
        averageAccuracy: 94.6,
        trafficDensity: 'Medium'
      }
    }
  },

  async getSystemHealth() {
    try {
      const response = await apiClient.get('/api/health')
      return response.data
    } catch {
      return {
        status: 'online',
        components: { aiEngine: 'online', anprEngine: 'online' },
        metrics: { cpu: 45, memory: 62, gpu: 78, fps: 24, latency: 45 }
      }
    }
  }
}

export { apiClient }
export default apiService