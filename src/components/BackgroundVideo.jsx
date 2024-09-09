"use client"

import React from "react"

const BackgroundVideo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/nakhon_phanom.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  )
}

export default BackgroundVideo
