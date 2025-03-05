'use client'

import dynamic from 'next/dynamic'

// Dynamically import the TourMap component to avoid SSR issues with Google Maps
const TourMap = dynamic(
  () => import('@/components/TourMap'),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Kaart laden...</div>
  }
)

interface Location {
  title: string
  location: string
  description?: string | null
  duration?: number
  order?: number
}

interface TourMapWrapperProps {
  startLocation: string
  stops: Location[]
}

export default function TourMapWrapper({ startLocation, stops }: TourMapWrapperProps) {
  return (
    <TourMap startLocation={startLocation} stops={stops} />
  )
}
