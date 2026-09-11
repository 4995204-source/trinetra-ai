// src/data/mockVehicleData.js

const MOCK_VEHICLES = {
  MH14AB1234: {
    plate: 'MH14AB1234',
    vehicle_type: 'SUV',
    trajectory: [
      {
        camera_id: 'CAM-001',
        camera: 'Wakad',
        location: 'Wakad',
        latitude: 18.5990,
        longitude: 73.7637,
        lat: 18.5990,
        lng: 73.7637,
        timestamp: '2026-09-02T06:30:00+05:30',
        confidence: 0.97,
      },
      {
        camera_id: 'CAM-014',
        camera: 'Balewadi',
        location: 'Balewadi',
        latitude: 18.5600,
        longitude: 73.7700,
        lat: 18.5600,
        lng: 73.7700,
        timestamp: '2026-09-02T06:42:00+05:30',
        confidence: 0.94,
      },
      {
        camera_id: 'CAM-008',
        camera: 'Baner',
        location: 'Baner',
        latitude: 18.5590,
        longitude: 73.7868,
        lat: 18.5590,
        lng: 73.7868,
        timestamp: '2026-09-02T06:55:00+05:30',
        confidence: 0.96,
      },
      {
        camera_id: 'CAM-021',
        camera: 'Aundh',
        location: 'Aundh',
        latitude: 18.5580,
        longitude: 73.8070,
        lat: 18.5580,
        lng: 73.8070,
        timestamp: '2026-09-02T07:08:00+05:30',
        confidence: 0.91,
      },
      {
        camera_id: 'CAM-003',
        camera: 'Shivajinagar',
        location: 'Shivajinagar',
        latitude: 18.5300,
        longitude: 73.8500,
        lat: 18.5300,
        lng: 73.8500,
        timestamp: '2026-09-02T07:22:00+05:30',
        confidence: 0.98,
      },
      {
        camera_id: 'CAM-005',
        camera: 'Deccan',
        location: 'Deccan',
        latitude: 18.5200,
        longitude: 73.8300,
        lat: 18.5200,
        lng: 73.8300,
        timestamp: '2026-09-02T07:35:00+05:30',
        confidence: 0.93,
      },
    ],
  },

  MH12XY5678: {
    plate: 'MH12XY5678',
    vehicle_type: 'Sedan',
    trajectory: [
      {
        camera_id: 'CAM-032',
        camera: 'Pimpri',
        location: 'Pimpri',
        latitude: 18.6200,
        longitude: 73.8000,
        lat: 18.6200,
        lng: 73.8000,
        timestamp: '2026-09-02T06:20:00+05:30',
        confidence: 0.95,
      },
      {
        camera_id: 'CAM-033',
        camera: 'Chinchwad',
        location: 'Chinchwad',
        latitude: 18.6300,
        longitude: 73.7800,
        lat: 18.6300,
        lng: 73.7800,
        timestamp: '2026-09-02T06:35:00+05:30',
        confidence: 0.92,
      },
      {
        camera_id: 'CAM-034',
        camera: 'Akurdi',
        location: 'Akurdi',
        latitude: 18.6400,
        longitude: 73.7700,
        lat: 18.6400,
        lng: 73.7700,
        timestamp: '2026-09-02T06:48:00+05:30',
        confidence: 0.96,
      },
      {
        camera_id: 'CAM-035',
        camera: 'Nigdi',
        location: 'Nigdi',
        latitude: 18.6500,
        longitude: 73.7600,
        lat: 18.6500,
        lng: 73.7600,
        timestamp: '2026-09-02T07:02:00+05:30',
        confidence: 0.94,
      },
      {
        camera_id: 'CAM-036',
        camera: 'Ravet',
        location: 'Ravet',
        latitude: 18.6400,
        longitude: 73.7400,
        lat: 18.6400,
        lng: 73.7400,
        timestamp: '2026-09-02T07:16:00+05:30',
        confidence: 0.97,
      },
    ],
  },

  MH14CD9999: {
    plate: 'MH14CD9999',
    vehicle_type: 'Hatchback',
    trajectory: [
      {
        camera_id: 'CAM-041',
        camera: 'Bhosari',
        location: 'Bhosari',
        latitude: 18.6200,
        longitude: 73.8500,
        lat: 18.6200,
        lng: 73.8500,
        timestamp: '2026-09-02T06:10:00+05:30',
        confidence: 0.93,
      },
      {
        camera_id: 'CAM-042',
        camera: 'Yerawada',
        location: 'Yerawada',
        latitude: 18.5500,
        longitude: 73.8900,
        lat: 18.5500,
        lng: 73.8900,
        timestamp: '2026-09-02T06:28:00+05:30',
        confidence: 0.90,
      },
      {
        camera_id: 'CAM-043',
        camera: 'Viman Nagar',
        location: 'Viman Nagar',
        latitude: 18.5600,
        longitude: 73.9100,
        lat: 18.5600,
        lng: 73.9100,
        timestamp: '2026-09-02T06:42:00+05:30',
        confidence: 0.96,
      },
      {
        camera_id: 'CAM-044',
        camera: 'Kharadi',
        location: 'Kharadi',
        latitude: 18.5480,
        longitude: 73.9400,
        lat: 18.5480,
        lng: 73.9400,
        timestamp: '2026-09-02T06:58:00+05:30',
        confidence: 0.95,
      },
      {
        camera_id: 'CAM-045',
        camera: 'Magarpatta',
        location: 'Magarpatta',
        latitude: 18.5100,
        longitude: 73.9300,
        lat: 18.5100,
        lng: 73.9300,
        timestamp: '2026-09-02T07:15:00+05:30',
        confidence: 0.92,
      },
      {
        camera_id: 'CAM-046',
        camera: 'Hadapsar',
        location: 'Hadapsar',
        latitude: 18.5000,
        longitude: 73.9200,
        lat: 18.5000,
        lng: 73.9200,
        timestamp: '2026-09-02T07:30:00+05:30',
        confidence: 0.97,
      },
    ],
  },

  MH15EF3456: {
    plate: 'MH15EF3456',
    vehicle_type: 'SUV',
    trajectory: [
      {
        camera_id: 'CAM-051',
        camera: 'Kondhwa',
        location: 'Kondhwa',
        latitude: 18.4600,
        longitude: 73.8900,
        lat: 18.4600,
        lng: 73.8900,
        timestamp: '2026-09-02T06:45:00+05:30',
        confidence: 0.94,
      },
      {
        camera_id: 'CAM-052',
        camera: 'Katraj',
        location: 'Katraj',
        latitude: 18.4500,
        longitude: 73.8600,
        lat: 18.4500,
        lng: 73.8600,
        timestamp: '2026-09-02T07:00:00+05:30',
        confidence: 0.96,
      },
      {
        camera_id: 'CAM-053',
        camera: 'Swargate',
        location: 'Swargate',
        latitude: 18.4950,
        longitude: 73.8550,
        lat: 18.4950,
        lng: 73.8550,
        timestamp: '2026-09-02T07:16:00+05:30',
        confidence: 0.91,
      },
      {
        camera_id: 'CAM-054',
        camera: 'Camp',
        location: 'Camp',
        latitude: 18.5150,
        longitude: 73.8800,
        lat: 18.5150,
        lng: 73.8800,
        timestamp: '2026-09-02T07:30:00+05:30',
        confidence: 0.95,
      },
      {
        camera_id: 'CAM-055',
        camera: 'Pune Station',
        location: 'Pune Station',
        latitude: 18.5300,
        longitude: 73.8700,
        lat: 18.5300,
        lng: 73.8700,
        timestamp: '2026-09-02T07:44:00+05:30',
        confidence: 0.98,
      },
    ],
  },

  MH14GH7890: {
    plate: 'MH14GH7890',
    vehicle_type: 'Car',
    trajectory: [
      {
        camera_id: 'CAM-061',
        camera: 'Hinjawadi',
        location: 'Hinjawadi',
        latitude: 18.5912,
        longitude: 73.7389,
        lat: 18.5912,
        lng: 73.7389,
        timestamp: '2026-09-02T06:00:00+05:30',
        confidence: 0.96,
      },
      {
        camera_id: 'CAM-062',
        camera: 'Wakad',
        location: 'Wakad',
        latitude: 18.5990,
        longitude: 73.7637,
        lat: 18.5990,
        lng: 73.7637,
        timestamp: '2026-09-02T06:15:00+05:30',
        confidence: 0.93,
      },
      {
        camera_id: 'CAM-063',
        camera: 'Baner',
        location: 'Baner',
        latitude: 18.5590,
        longitude: 73.7868,
        lat: 18.5590,
        lng: 73.7868,
        timestamp: '2026-09-02T06:30:00+05:30',
        confidence: 0.95,
      },
      {
        camera_id: 'CAM-064',
        camera: 'Pashan',
        location: 'Pashan',
        latitude: 18.5400,
        longitude: 73.7900,
        lat: 18.5400,
        lng: 73.7900,
        timestamp: '2026-09-02T06:45:00+05:30',
        confidence: 0.92,
      },
      {
        camera_id: 'CAM-065',
        camera: 'Kothrud',
        location: 'Kothrud',
        latitude: 18.5100,
        longitude: 73.8100,
        lat: 18.5100,
        lng: 73.8100,
        timestamp: '2026-09-02T07:00:00+05:30',
        confidence: 0.97,
      },
    ],
  },
}

export const getMockVehicle = (plate) => {
  const normalizedPlate = plate.trim().toUpperCase()

  return MOCK_VEHICLES[normalizedPlate] || generateFallbackVehicle(normalizedPlate)
}

export const getMockDetections = (plate) => {
  const vehicle = getMockVehicle(plate)

  return vehicle.trajectory.map((point) => ({
    plate: vehicle.plate,
    camera: point.camera,
    camera_id: point.camera_id,
    location: point.location,
    timestamp: point.timestamp,
    confidence: point.confidence,
    vehicle: {
      class: vehicle.vehicle_type,
      class_id: getVehicleClassId(vehicle.vehicle_type),
    },
    latitude: point.latitude,
    longitude: point.longitude,
  }))
}

const getVehicleClassId = (type) => {
  const ids = {
    Car: 2,
    SUV: 2,
    Sedan: 2,
    Hatchback: 2,
    Truck: 7,
    Bus: 5,
    Motorcycle: 3,
  }

  return ids[type] || 2
}

// Fallback for any plate that isn't explicitly listed above.
// This gives you data even when the user enters a completely new number.
const FALLBACK_ROUTES = [
  ['Shivajinagar', 'Deccan', 'Pune Station', 'Camp', 'Swargate'],
  ['Wakad', 'Baner', 'Aundh', 'Shivajinagar', 'Deccan'],
  ['Hinjawadi', 'Balewadi', 'Baner', 'Pashan', 'Kothrud'],
  ['Pimpri', 'Chinchwad', 'Akurdi', 'Nigdi', 'Ravet'],
  ['Bhosari', 'Yerawada', 'Viman Nagar', 'Kharadi', 'Hadapsar'],
  ['Kondhwa', 'Katraj', 'Swargate', 'Camp', 'Pune Station'],
  ['Hadapsar', 'Magarpatta', 'Kharadi', 'Viman Nagar', 'Koregaon Park'],
]

const LOCATION_LOOKUP = {
  Shivajinagar: [18.5300, 73.8500],
  Deccan: [18.5200, 73.8300],
  'Pune Station': [18.5300, 73.8700],
  Camp: [18.5150, 73.8800],
  Swargate: [18.4950, 73.8550],
  Wakad: [18.5990, 73.7637],
  Hinjawadi: [18.5912, 73.7389],
  Baner: [18.5590, 73.7868],
  Aundh: [18.5580, 73.8070],
  Balewadi: [18.5600, 73.7700],
  Pashan: [18.5400, 73.7900],
  Bhosari: [18.6200, 73.8500],
  Pimpri: [18.6200, 73.8000],
  Chinchwad: [18.6300, 73.7800],
  Nigdi: [18.6500, 73.7600],
  Ravet: [18.6400, 73.7400],
  Akurdi: [18.6400, 73.7700],
  'Viman Nagar': [18.5600, 73.9100],
  Kharadi: [18.5480, 73.9400],
  Hadapsar: [18.5000, 73.9200],
  Magarpatta: [18.5100, 73.9300],
  Katraj: [18.4500, 73.8600],
  Kondhwa: [18.4600, 73.8900],
  'Koregaon Park': [18.5360, 73.8950],
  Kothrud: [18.5100, 73.8100],
  Yerawada: [18.5500, 73.8900],
}

function generateFallbackVehicle(plate) {
  // Stable route selection based on plate characters.
  // This is important: same plate = same route every time.
  const hash = [...plate].reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0
  )

  const route = FALLBACK_ROUTES[hash % FALLBACK_ROUTES.length]

  const vehicleTypes = ['Car', 'SUV', 'Sedan', 'Hatchback']
  const vehicleType = vehicleTypes[hash % vehicleTypes.length]

  const baseTime = new Date('2026-09-02T06:30:00+05:30')

  const trajectory = route.map((locationName, index) => {
    const [lat, lng] = LOCATION_LOOKUP[locationName]

    return {
      camera_id: `MOCK-CAM-${String(index + 1).padStart(3, '0')}`,
      camera: locationName,
      location: locationName,
      latitude: lat,
      longitude: lng,
      lat,
      lng,
      timestamp: new Date(
        baseTime.getTime() + index * 14 * 60 * 1000
      ).toISOString(),
      confidence: Number((0.90 + ((hash + index) % 9) / 100).toFixed(2)),
    }
  })

  const lastPoint = trajectory[trajectory.length - 1]

  // Pick nearby-ish prediction destinations.
  const allLocations = Object.entries(LOCATION_LOOKUP)

  const predictions = allLocations
    .filter(([name]) => name !== lastPoint.location)
    .slice(hash % 5, (hash % 5) + 3)
    .map(([location], index) => ({
      location,
      probability: Math.max(45, 90 - index * 18),
    }))

  return {
    plate,
    vehicle: plate,
    vehicle_type: vehicleType,
    trajectory,
    predictions,
  }
}

export default MOCK_VEHICLES
