import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ShareTourLink from '@/components/ShareTourLink'

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

export default async function TourDetailPage({ params }: Props) {
  const { id } = await params
  const tour = await getTour(id)

  if (!tour) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{tour.title}</h1>
          <div className="flex space-x-4">
            <a
              href={`/tours/edit/${tour.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Bewerken
            </a>
            <a
              href={`/tour/${tour.id}`} target="_blank"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Bekijk tour
            </a>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <ShareTourLink tourId={tour.id} />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Details</h2>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Startlocatie</dt>
                    <dd className="mt-1 text-sm text-gray-900">{tour.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Prijs</dt>
                    <dd className="mt-1 text-sm text-gray-900">€{tour.price.toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Duur</dt>
                    <dd className="mt-1 text-sm text-gray-900">{tour.duration} uur</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Maximum aantal mensen</dt>
                    <dd className="mt-1 text-sm text-gray-900">{tour.maxPeople}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Beschrijving</h2>
                <p className="text-sm text-gray-500 whitespace-pre-line">{tour.description}</p>
              </div>
            </div>
          </div>
        </div>

        {tour.stops.length > 0 && (
          <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tussenstops</h2>
              <div className="space-y-6">
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
                        <h3 className="text-base font-medium text-gray-900">{stop.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {stop.location} • {stop.duration} minuten
                        </p>
                        {stop.description && (
                          <p className="mt-2 text-sm text-gray-500">{stop.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
