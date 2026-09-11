export const mockCameras = [
  {
    id: 'CAM-001',
    name: 'Wakad Junction',
    location: 'Wakad',
    lat: 18.5990,
    lng: 73.7637,
    status: 'online',
    trafficLevel: 'Heavy',
    vehicleCount: 2340
  },
  {
    id: 'CAM-002',
    name: 'Hinjawadi Phase 1',
    location: 'Hinjawadi',
    lat: 18.5912,
    lng: 73.7389,
    status: 'online',
    trafficLevel: 'Heavy',
    vehicleCount: 3120
  },
  {
    id: 'CAM-003',
    name: 'Baner Road',
    location: 'Baner',
    lat: 18.5590,
    lng: 73.7868,
    status: 'online',
    trafficLevel: 'Medium',
    vehicleCount: 2890
  },
  {
    id: 'CAM-004',
    name: 'Shivajinagar Junction',
    location: 'Shivajinagar',
    lat: 18.5300,
    lng: 73.8500,
    status: 'online',
    trafficLevel: 'Medium',
    vehicleCount: 4100
  },
  {
    id: 'CAM-005',
    name: 'Aundh Bridge',
    location: 'Aundh',
    lat: 18.5580,
    lng: 73.8070,
    status: 'online',
    trafficLevel: 'Low',
    vehicleCount: 1500
  }
]

export const mockDetections = [
  { plate: 'MH14AB1234', cameraId: 'CAM-001', location: 'Wakad', time: '10:42:11 AM', confidence: 96, vehicleType: 'Car' },
  { plate: 'MH12XY5678', cameraId: 'CAM-003', location: 'Baner', time: '10:41:58 AM', confidence: 92, vehicleType: 'SUV' },
  { plate: 'MH14CD9999', cameraId: 'CAM-002', location: 'Hinjawadi', time: '10:41:44 AM', confidence: 88, vehicleType: 'Bike' },
  { plate: 'MH15EF3456', cameraId: 'CAM-001', location: 'Wakad', time: '10:41:22 AM', confidence: 94, vehicleType: 'Bus' },
  { plate: 'MH14GH7890', cameraId: 'CAM-004', location: 'Shivajinagar', time: '10:41:05 AM', confidence: 97, vehicleType: 'Car' }
]

export const mockTrafficData = [
  { label: '8 AM', value: 300 },
  { label: '9 AM', value: 700 },
  { label: '10 AM', value: 1200 },
  { label: '11 AM', value: 950 },
  { label: '12 PM', value: 800 },
  { label: '1 PM', value: 650 }
]

export default { mockCameras, mockDetections, mockTrafficData }