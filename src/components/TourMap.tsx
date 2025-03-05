'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { LoadScript, GoogleMap, Marker, DirectionsService, DirectionsRenderer, InfoWindow } from '@react-google-maps/api'

interface Location {
  title: string
  location: string
  description?: string | null
  duration?: number
  order?: number
}

interface TourMapProps {
  startLocation: string
  stops: Location[]
}

const containerStyle = {
  width: '100%',
  height: '400px'
}

const defaultCenter = {
  lat: 52.3676, // Amsterdam
  lng: 4.9041
}

export default function TourMap({ startLocation, stops }: TourMapProps) {
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [isLoaded, setIsLoaded] = useState(false)
  const [markers, setMarkers] = useState<Array<Location & { position: google.maps.LatLngLiteral }>>([])
  const [selectedLocation, setSelectedLocation] = useState<(Location & { position: google.maps.LatLngLiteral }) | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showInfoWindow, setShowInfoWindow] = useState<number | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [directionsRequested, setDirectionsRequested] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)
  
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])
  
  // Fit map bounds to include all markers
  useEffect(() => {
    if (mapRef.current && markers.length > 1) {
      const bounds = new google.maps.LatLngBounds()
      markers.forEach(marker => bounds.extend(marker.position))
      mapRef.current.fitBounds(bounds)
    }
  }, [markers])
  
  // Geocode locations to get coordinates
  useEffect(() => {
    if (!isLoaded || !window.google) return

    const geocodeLocation = async (location: string, details: Location) => {
      try {
        const geocoder = new google.maps.Geocoder()
        return new Promise<Location & { position: google.maps.LatLngLiteral }>((resolve, reject) => {
          geocoder.geocode({ address: location }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const position = results[0].geometry.location
              resolve({
                ...details,
                position: { 
                  lat: position.lat(), 
                  lng: position.lng() 
                }
              })
            } else {
              reject(new Error(`Geocoding failed for ${location}: ${status}`))
            }
          })
        })
      } catch (error) {
        console.error('Geocoding error:', error)
        return null
      }
    }

    const geocodeAllLocations = async () => {
      try {
        // Geocode start location
        const startMarker = await geocodeLocation(startLocation, { 
          title: 'Start', 
          location: startLocation,
          order: 0
        })
        
        if (startMarker) {
          setMapCenter(startMarker.position)
        }
        
        // Geocode all stops
        const stopPromises = stops.map((stop, index) => 
          geocodeLocation(stop.location, { 
            ...stop,
            order: index + 1
          })
        )
        
        const results = await Promise.all([startMarker, ...stopPromises])
        const validMarkers = results.filter(Boolean) as Array<Location & { position: google.maps.LatLngLiteral }>
        setMarkers(validMarkers)
      } catch (error) {
        console.error('Error geocoding locations:', error)
      }
    }

    geocodeAllLocations()
  }, [startLocation, stops, isLoaded])

  return (
    <>
      <LoadScript
        googleMapsApiKey="AIzaSyAKXBGzZz_TXRMPda3Zf_AkfTP9JOix3zw"
        libraries={['places']}
        onLoad={() => setIsLoaded(true)}
      >
        <div className="rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={12}
            onLoad={onMapLoad}
            options={{
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
              zoomControl: true
            }}
          >
            {/* DirectionsService to calculate the route */}
            {markers.length > 1 && !directionsRequested && (
              <DirectionsService
                options={{
                  origin: markers.find(m => m.order === 0)?.position || mapCenter,
                  destination: markers.sort((a, b) => (a.order || 0) - (b.order || 0)).slice(-1)[0].position,
                  waypoints: markers
                    .filter(marker => (marker.order || 0) > 0 && (marker.order || 0) < markers.length - 1)
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map(marker => ({
                      location: marker.position,
                      stopover: true
                    })),
                  travelMode: google.maps.TravelMode.WALKING,
                  optimizeWaypoints: false
                }}
                callback={(result, status) => {
                  if (status === 'OK' && result) {
                    setDirections(result)
                  } else if (status !== 'OK') {
                    console.error('Directions request failed with status:', status)
                  }
                  setDirectionsRequested(true)
                }}
              />
            )}

            {/* DirectionsRenderer to show the route */}
            {directions && (
              <DirectionsRenderer
                options={{
                  directions: directions,
                  suppressMarkers: true, // We'll use our own markers
                  polylineOptions: {
                    strokeColor: '#4F46E5', // primary color
                    strokeOpacity: 0.8,
                    strokeWeight: 4
                  }
                }}
              />
            )}

            {/* Markers for each location */}
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                label={{
                  text: marker.order?.toString() || '',
                  color: 'white',
                  fontWeight: 'bold'
                }}
                onClick={() => {
                  setSelectedLocation(marker)
                  setShowModal(true)
                }}
                onMouseOver={() => setShowInfoWindow(index)}
                onMouseOut={() => setShowInfoWindow(null)}
              >
                {showInfoWindow === index && (
                  <InfoWindow
                    position={marker.position}
                    onCloseClick={() => setShowInfoWindow(null)}
                  >
                    <div className="p-1">
                      <p className="font-semibold">{marker.title}</p>
                      <p className="text-xs text-gray-600">{marker.order === 0 ? 'Startlocatie' : `Stop ${marker.order}`}</p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        </div>
      </LoadScript>

      {/* Location Modal */}
      {showModal && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">
                  {(selectedLocation.order || 0) === 0 ? 'Startlocatie' : `Stop ${selectedLocation.order || ''}`}: {selectedLocation.title}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Locatie</p>
                <p className="mt-1 text-base text-gray-900">{selectedLocation.location}</p>
              </div>
              
              {selectedLocation.duration && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Duur</p>
                  <p className="mt-1 text-base text-gray-900">{selectedLocation.duration} minuten</p>
                </div>
              )}
              
              {selectedLocation.description && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Beschrijving</p>
                  <p className="mt-1 text-base text-gray-900 whitespace-pre-line">{selectedLocation.description}</p>
                </div>
              )}
              
              <div className="mt-6 flex flex-wrap gap-2">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLocation.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Bekijk in Google Maps
                </a>
                
                {(selectedLocation.order || 0) > 0 && markers.length > 1 && (
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(markers.find(m => m.order === (selectedLocation.order || 0) - 1)?.location || '')}&destination=${encodeURIComponent(selectedLocation.location)}&travelmode=walking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Route naar deze locatie
                  </a>
                )}
                
                {(selectedLocation.order || 0) < markers.length - 1 && (
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(selectedLocation.location)}&destination=${encodeURIComponent(markers.find(m => m.order === (selectedLocation.order || 0) + 1)?.location || '')}&travelmode=walking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Route naar volgende stop
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
