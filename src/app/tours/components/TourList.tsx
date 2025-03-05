'use client'

import { useEffect, useState } from 'react'

interface Stop {
  id: number
  title: string
  description: string
  location: string
  duration: number
  order: number
}

interface Tour {
  id: number
  title: string
  description: string
  price: number
  duration: number
  location: string
  maxPeople: number
  stops: Stop[]
}

export default function TourList() {
  const [tours, setTours] = useState<Tour[]>([])

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/tours')
        if (!response.ok) throw new Error('Failed to fetch tours')
        const data = await response.json()
        setTours(data)
      } catch (error) {
        console.error('Error fetching tours:', error)
      }
    }

    fetchTours()
  }, [])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-background text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Titel
            </th>
            <th className="px-6 py-3 bg-background text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              Prijs
            </th>
            <th className="px-6 py-3 bg-background text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              Duur
            </th>
            <th className="px-6 py-3 bg-background text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              Max personen
            </th>
            <th className="px-6 py-3 bg-background text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              Tussenstops
            </th>
            <th className="px-6 py-3 bg-background text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              Acties
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tours.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                Geen tours beschikbaar
              </td>
            </tr>
          ) : (
            tours.map((tour) => (
              <tr 
                key={tour.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => window.location.href = `/tours/${tour.id}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tour.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  €{tour.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {tour.duration} uur
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {tour.maxPeople}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {tour.stops.length} {tour.stops.length === 1 ? 'stop' : 'stops'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={async () => {
                        if (confirm('Weet je zeker dat je deze tour wilt verwijderen?')) {
                          try {
                            const response = await fetch(`/api/tours/${tour.id}`, {
                              method: 'DELETE',
                            })
                            if (!response.ok) throw new Error('Failed to delete tour')
                            window.location.reload()
                          } catch (error) {
                            console.error('Error deleting tour:', error)
                          }
                        }
                      }}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Verwijderen
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )}
