'use client'

import { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Prevent mapbox-gl from crashing in SSR
// This is a workaround for the "window is not defined" error in SSR
// No need to assign mapboxgl to window.mapboxgl

interface Location {
  title: string
  location: string
  description?: string | null
  startTime?: string
  endTime?: string
  order?: number
}

interface TourMapProps {
  startLocation: string
  stops: Location[]
}

interface MarkerData extends Location {
  position: [number, number] // [longitude, latitude]
}

const defaultCenter = {
  lng: 4.9041, // Amsterdam
  lat: 52.3676
}

export default function TourMap({ startLocation, stops }: TourMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<(MarkerData & { marker: mapboxgl.Marker })[]>([])
  const [selectedLocation, setSelectedLocation] = useState<MarkerData | null>(null)
  const [showModal, setShowModal] = useState(false)
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return
    
    mapboxgl.accessToken = accessToken
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 12
    })
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [accessToken])
  
  // Geocode locations to get coordinates
  useEffect(() => {
    if (!map.current) return
    
    const geocodeLocation = async (location: string, details: Location) => {
      try {
        // Debug token
        console.log('Using Mapbox token in TourMap:', accessToken.substring(0, 10) + '...')
        
        // Create URL
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${accessToken}&country=nl&limit=5&types=place,address,poi`
        
        console.log('Geocoding URL:', url)
        
        // Add country code to improve results and increase limit
        const response = await fetch(url)
        
        // Log response status
        console.log('Geocoding response status:', response.status, response.statusText)
        
        if (!response.ok) {
          throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.features && data.features.length > 0) {
          // Log all results for debugging
          console.log(`Geocoding results for ${location}:`, data.features.map((f: { place_name: string }) => f.place_name))
          
          // Use the first result
          const [longitude, latitude] = data.features[0].center
          return {
            ...details,
            position: [longitude, latitude] as [number, number]
          }
        } else {
          // Fallback for "Grote Markt, Amsterdam" specifically
          if (location === "Grote Markt, Amsterdam") {
            console.log("Using fallback coordinates for Grote Markt, Amsterdam")
            return {
              ...details,
              position: [4.8952, 52.3702] as [number, number] // Coordinates for Dam Square in Amsterdam
            }
          }
          
          // Fallback for any location - use Amsterdam center
          console.error(`Geocoding failed for ${location}: No results, using Amsterdam center as fallback`)
          return {
            ...details,
            position: [4.9041, 52.3676] as [number, number] // Amsterdam center
          }
        }
      } catch (error) {
        console.error('Geocoding error:', error)
        
        // Fallback for errors - use Amsterdam center
        console.log(`Using fallback coordinates for ${location} due to error`)
        return {
          ...details,
          position: [4.9041, 52.3676] as [number, number] // Amsterdam center
        }
      }
    }

    const geocodeAllLocations = async () => {
      try {
        // Clear existing markers
        markersRef.current.forEach(m => m.marker.remove())
        markersRef.current = []
        
        // Geocode start location
        const startMarker = await geocodeLocation(startLocation, { 
          title: 'Start', 
          location: startLocation,
          order: 0
        })
        
        // Geocode all stops
        const stopPromises = stops.map((stop, index) => 
          geocodeLocation(stop.location, { 
            ...stop,
            order: index + 1
          })
        )
        
        const results = await Promise.all([startMarker, ...stopPromises].filter(Boolean))
        const validResults = results.filter(Boolean) as MarkerData[]
        
        if (validResults.length === 0) return
        
        // Center map on first marker
        if (map.current && validResults[0]) {
          map.current.setCenter(validResults[0].position as [number, number])
        }
        
        // Create markers
        const newMarkers = validResults.map(location => {
          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <p class="font-semibold">${location.title}</p>
              <p class="text-xs text-gray-600">
                ${location.order === 0 ? 'Startlocatie' : `Stop ${location.order}`}
              </p>
            </div>
          `)
          
          // Create marker element
          const el = document.createElement('div')
          
          // Use different style for start location (order 0)
          if (location.order === 0) {
            el.className = 'flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold cursor-pointer'
            el.textContent = 'S' // 'S' for Start
          } else {
            el.className = 'flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold cursor-pointer'
            el.textContent = location.order?.toString() || ''
          }
          el.style.display = 'flex'
          el.style.alignItems = 'center'
          el.style.justifyContent = 'center'
          
          // Add click handler to show modal
          el.addEventListener('click', () => {
            setSelectedLocation(location)
            setShowModal(true)
          })
          
          // Create and add marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat(location.position as [number, number])
            .setPopup(popup)
            .addTo(map.current!)
          
          // Show popup on hover
          el.addEventListener('mouseenter', () => {
            marker.togglePopup()
          })
          
          // Hide popup when mouse leaves
          el.addEventListener('mouseleave', () => {
            // Small delay to make it feel more natural
            setTimeout(() => {
              const popup = marker.getPopup()
              if (popup && popup.isOpen()) {
                marker.togglePopup()
              }
            }, 300)
          })
          
          return { ...location, marker }
        })
        
        markersRef.current = newMarkers
        
        // Fit bounds to include all markers
        if (map.current && newMarkers.length > 1) {
          const bounds = new mapboxgl.LngLatBounds()
          newMarkers.forEach(marker => bounds.extend(marker.position as [number, number]))
          
          map.current.fitBounds(bounds, {
            padding: 40,
            duration: 1000
          })
        }
        
        // Draw route if we have at least 2 markers
        if (map.current && newMarkers.length >= 2) {
          await getDirections(newMarkers.map(m => m as MarkerData))
        }
      } catch (error) {
        console.error('Error geocoding locations:', error)
      }
    }

    geocodeAllLocations()
  }, [startLocation, stops, accessToken])
  
  // Get directions between markers
  const getDirections = async (markerList: MarkerData[]) => {
    if (!map.current) return
    
    try {
      // Sort markers by order
      const sortedMarkers = [...markerList].sort((a, b) => (a.order || 0) - (b.order || 0))
      
      // Create coordinates string for the API
      const coordinates = sortedMarkers
        .map(marker => marker.position.join(','))
        .join(';')
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?geometries=geojson&access_token=${accessToken}`
      )
      
      const data = await response.json()
      
      if (data.routes && data.routes.length > 0) {
        // Remove existing route layer and source
        if (map.current.getLayer('route-line')) {
          map.current.removeLayer('route-line')
        }
        if (map.current.getSource('route')) {
          map.current.removeSource('route')
        }
        
        // Add route to map
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: data.routes[0].geometry
          }
        })
        
        map.current.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4F46E5',
            'line-width': 4,
            'line-opacity': 0.8
          }
        })
      }
    } catch (error) {
      console.error('Error getting directions:', error)
    }
  }

  return (
    <>
      <div ref={mapContainer} className="rounded-lg overflow-hidden h-[400px]" />

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
              
              {selectedLocation.startTime && selectedLocation.endTime && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Tijd</p>
                  <p className="mt-1 text-base text-gray-900">{selectedLocation.startTime} tot {selectedLocation.endTime}</p>
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
                  href={`https://www.mapbox.com/maps/streets/?q=${encodeURIComponent(selectedLocation.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Bekijk in Mapbox
                </a>
                
                {(selectedLocation.order || 0) > 0 && markersRef.current.length > 1 && (
                  <a 
                    href={`https://www.mapbox.com/directions/?origin=${markersRef.current.find(m => m.order === (selectedLocation.order || 0) - 1)?.position.join(',')}&destination=${selectedLocation.position.join(',')}&profile=walking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Route naar deze locatie
                  </a>
                )}
                
                {(selectedLocation.order || 0) < markersRef.current.length - 1 && (
                  <a 
                    href={`https://www.mapbox.com/directions/?origin=${selectedLocation.position.join(',')}&destination=${markersRef.current.find(m => m.order === (selectedLocation.order || 0) + 1)?.position.join(',')}&profile=walking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
