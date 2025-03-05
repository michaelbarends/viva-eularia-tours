import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TourMapWrapper from '@/components/TourMapWrapper'

interface Props {
  params: { id: string }
}

async function getTour(id: string) {
  const tour = await prisma.tour.findUnique({
    where: {
      id: parseInt(id)
    },
    include: {
      stops: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  })

  if (!tour) {
    return null
  }

  return tour
}

export default async function PublicTourPage({ params }: Props) {
  const { id } = await params
  const tour = await getTour(id)

  if (!tour) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tour.title}</h1>
              <p className="mt-1 text-sm text-gray-500">Startlocatie: {tour.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Duur: {tour.duration} uur</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Beschrijving</h2>
            <p className="text-gray-700 whitespace-pre-line">{tour.description}</p>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Route</h2>
            <TourMapWrapper 
              startLocation={tour.location} 
              stops={tour.stops.map(stop => ({ 
                title: stop.title, 
                location: stop.location,
                description: stop.description,
                duration: stop.duration
              }))} 
            />
          </div>
        </div>

        {tour.stops.length > 0 && (
          <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tussenstops</h2>
              <div className="space-y-8">
                {tour.stops.map((stop, index) => (
                  <div key={stop.id} className="relative">
                    {index < tour.stops.length - 1 && (
                      <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-200"></div>
                    )}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                          {index + 1}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{stop.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {stop.location} • {stop.duration} minuten
                        </p>
                        {stop.description && (
                          <p className="mt-2 text-gray-700">{stop.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Boek deze tour</h2>
            <p className="text-gray-700 mb-4">
              Neem contact op om deze tour te boeken of voor meer informatie.
            </p>
            <a
              href="mailto:info@viva-eularia.nl?subject=Tour%20boeking"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Contact opnemen
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} Viva Eularia</p>
            </div>
            <div>
              <a href="http://vivaeularia.com/" target="_blank" className="text-sm text-primary hover:text-primary/80">
                www.vivaeularia.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
