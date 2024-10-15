import Carousel from "@/components/Dashboard/Carousel"
import NearbyPlaces from "@/components/Dashboard/Places/NearbyPlaces"
import CurrentlyOpenTouristEntities from "@/components/Dashboard/Places/CurrentlyOpen"
import RealTimeSeasonalAttractions from "@/components/Dashboard/Places/RealTime"

export default function Dashboard() {
  return (
    <>
      {/* <BackgroundVideo /> */}
      <div>
        <Carousel />
      </div>
      <div>
        <RealTimeSeasonalAttractions />
      </div>
      <div>
        <NearbyPlaces />
      </div>
      <div>
        <CurrentlyOpenTouristEntities />
      </div>
    </>
  )
}
