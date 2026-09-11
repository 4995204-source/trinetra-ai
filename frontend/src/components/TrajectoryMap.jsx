import React from 'react'


function TrajectoryMap({
  trajectory = [],
  vehicle = null
}) {

  if (!trajectory || trajectory.length === 0) {

    return (

      <div className="w-full h-[450px]
      flex items-center justify-center
      bg-dark-hover rounded-xl">

        <div className="text-center">

          <p className="text-gray-400">
            No trajectory data available
          </p>

        </div>

      </div>

    )

  }


  const first =
    trajectory[0]

  const last =
    trajectory[trajectory.length - 1]


  const latitude =
    first?.latitude ?? 18.5204

  const longitude =
    first?.longitude ?? 73.8567


  const mapUrl =
    `https://www.google.com/maps?q=${latitude},${longitude}&z=13&output=embed`


  return (

    <div className="relative w-full h-[450px]">

      <iframe
        title="TRINETRA AI Trajectory Map"
        src={mapUrl}
        width="100%"
        height="100%"
        style={{
          border: 0
        }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />


      {/* VEHICLE INFO */}

      <div className="absolute
      top-4 left-4
      bg-black/80 backdrop-blur-md
      rounded-xl px-4 py-3">

        <p className="text-xs text-gray-400">
          Tracking Vehicle
        </p>

        <p className="text-sm
        font-bold text-white font-mono mt-1">

          {vehicle || 'Unknown'}

        </p>

      </div>


      {/* CURRENT LOCATION */}

      <div className="absolute
      bottom-4 right-4
      bg-black/80 backdrop-blur-md
      rounded-xl px-4 py-3">

        <p className="text-xs text-gray-400">
          Current Location
        </p>

        <p className="text-xs
        text-white font-mono mt-1">

          {last?.latitude ?? 'N/A'},
          {' '}
          {last?.longitude ?? 'N/A'}

        </p>

      </div>

    </div>

  )

}


export default TrajectoryMap