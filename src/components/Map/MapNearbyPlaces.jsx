"use client"
import React, { useCallback, useRef, useState, useEffect } from "react"
import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  Circle,
  DirectionsRenderer
} from "@react-google-maps/api"
import Image from "next/image"
import {
  FaMapMarkerAlt,
  FaInfoCircle,
  FaMapSigns,
  FaExternalLinkAlt
} from "react-icons/fa"

const MapNearbyPlaces = ({ center, places, mainPlace, isLoaded }) => {
  const mapRef = useRef(null)
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null) // State for hover effect
  const [directions, setDirections] = useState(null)

  const onMapLoad = useCallback(map => {
    mapRef.current = map
  }, [])

  const getIconForPlaceType = type => {
    switch (type) {
      case "สถานที่ท่องเที่ยว":
        return "/icons/pin.png"
      case "ที่พัก":
        return "/icons/hotel.png"
      case "ร้านอาหาร":
        return "/icons/restaurant.png"
      case "ร้านค้าของฝาก":
        return "/icons/shop.png"
      default:
        return "/icons/pin.png"
    }
  }

  const calculateRoutes = useCallback(() => {
    if (!isLoaded || !window.google || !window.google.maps || !mapRef.current)
      return

    const directionsService = new window.google.maps.DirectionsService()
    const destinations = places

    if (destinations.length === 0) return

    directionsService.route(
      {
        origin: center,
        destination: destinations[0]
          ? {
              lat: Number(destinations[0].latitude),
              lng: Number(destinations[0].longitude)
            }
          : center,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: destinations.slice(1).map(place => ({
          location: {
            lat: Number(place.latitude),
            lng: Number(place.longitude)
          },
          stopover: true
        })),
        optimizeWaypoints: true
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result)
        } else {
          console.error(`Error fetching directions: ${status}`)
        }
      }
    )
  }, [isLoaded, center, places])

  useEffect(() => {
    calculateRoutes()
  }, [calculateRoutes])

  if (!isLoaded) {
    return <div>Loading Maps...</div>
  }

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-lg shadow-md overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ color: "#fef3e2" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#b3d9ff" }]
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#ffa726" }, { lightness: 40 }]
            },
            {
              featureType: "road",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffcc80" }]
            },
            {
              featureType: "poi",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffebcc" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry.fill",
              stylers: [{ color: "#fff5e6" }]
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [{ color: "#f9a825" }, { lightness: 50 }]
            }
          ]
        }}
        onLoad={onMapLoad}
      >
        {/* Main Place Marker */}
        <MarkerF
          position={center}
          title={mainPlace.name}
          icon={{
            url: "/icons/pin.png",
            scaledSize: new window.google.maps.Size(50, 50)
          }}
          onClick={() => setSelectedEntity(mainPlace)}
        />

        {/* Markers for Nearby Places */}
        {places.map(entity => (
          <MarkerF
            key={entity.id}
            position={{
              lat: Number(entity.latitude),
              lng: Number(entity.longitude)
            }}
            title={entity.name}
            icon={{
              url: getIconForPlaceType(entity.category_name),
              scaledSize: new window.google.maps.Size(40, 40)
            }}
            onMouseOver={() => setHoveredMarkerId(entity.id)}
            onMouseOut={() => setHoveredMarkerId(null)}
            animation={
              hoveredMarkerId === entity.id
                ? google.maps.Animation.BOUNCE
                : undefined
            }
            onClick={() => setSelectedEntity(entity)}
          />
        ))}

        {/* Directions Renderer */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#FF7043",
                strokeOpacity: 0.8,
                strokeWeight: 6
              }
            }}
          />
        )}

        {/* InfoWindow for Selected Place */}
        {selectedEntity && (
          <InfoWindowF
            position={{
              lat: Number(selectedEntity.latitude),
              lng: Number(selectedEntity.longitude)
            }}
            onCloseClick={() => setSelectedEntity(null)}
            options={{ maxWidth: 350 }}
          >
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg flex flex-col">
              <div className="flex flex-col items-start">
                {selectedEntity.images && selectedEntity.images[0] ? (
                  <Image
                    src={selectedEntity.images[0].image_url}
                    alt={selectedEntity.name}
                    width={350}
                    height={150}
                    className="rounded-t-lg mb-2 object-cover"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                  </div>
                )}
                <div className="p-3 w-full flex flex-col">
                  <h3 className="text-orange-500 font-bold mt-2">
                    {selectedEntity.name}
                  </h3>
                  <p className="text-gray-700 text-sm flex items-center mb-1">
                    <FaInfoCircle className="text-blue-500 mr-2" />
                    {selectedEntity.description || "ไม่มีคำอธิบาย"}
                  </p>
                  <div className="flex items-center mb-1">
                    <FaMapMarkerAlt className="text-green-500 w-4 h-4 mr-2" />
                    <div className="text-xs">
                      <p className="text-gray-900 leading-none">
                        {selectedEntity.district_name}
                      </p>
                      <p className="text-gray-600">
                        {selectedEntity.distance?.toFixed(2) || 0} กม. จากคุณ
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-1">
                    <FaMapSigns className="text-blue-500 w-4 h-4 mr-2" />
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedEntity.latitude},${selectedEntity.longitude}&travelmode=driving`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-xs underline"
                    >
                      นำทางไปยังสถานที่นี้
                    </a>
                  </div>
                  <div className="flex items-center">
                    <FaExternalLinkAlt className="text-blue-500 w-4 h-4 mr-2" />
                    <a
                      href={`https://www.google.com/maps/place/${encodeURIComponent(
                        selectedEntity.name
                      )}/@${selectedEntity.latitude},${
                        selectedEntity.longitude
                      },17z`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-xs underline"
                    >
                      ดูบน Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </InfoWindowF>
        )}

        {/* User Location Circle */}
        <Circle
          center={center}
          radius={1000}
          options={{
            fillColor: "#FF8A65",
            fillOpacity: 0.1,
            strokeColor: "#FF7043",
            strokeOpacity: 0.3,
            strokeWeight: 2
          }}
        />
      </GoogleMap>
    </div>
  )
}

export default MapNearbyPlaces
