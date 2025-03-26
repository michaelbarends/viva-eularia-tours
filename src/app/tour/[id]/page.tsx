import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TourMapWrapper from '@/components/TourMapWrapper'
import DescriptionModal from '@/components/DescriptionModal'
import StopsModal from '@/components/StopsModal'
import ContactModal from '@/components/ContactModal'

// Define types for the tour page
interface StopWithTimeRange {
  id: number
  title: string
  description: string | null
  location: string
  startTime: string
  endTime: string
  order: number
  tourId: number
  createdAt: Date
  updatedAt: Date
}

interface TourWithStops {
  id: number
  title: string
  description: string
  price: number
  duration: number
  location: string
  maxPeople: number
  stops: StopWithTimeRange[]
  createdAt: Date
  updatedAt: Date
}

interface Props {
  params: { id: string }
}

async function getTour(id: string): Promise<TourWithStops | null> {
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

  // Cast the tour to include the new fields
  return tour as unknown as TourWithStops
}

export default async function PublicTourPage({ params }: Props) {
  const { id } = await params
  const tour = await getTour(id)

  if (!tour) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-background border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center">
            <img src="/viva-eularia-logo.svg" alt="Viva Eularia" className="h-8" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Route</h2>
            <TourMapWrapper 
              startLocation={tour.location} 
              stops={tour.stops.map(stop => ({ 
                title: stop.title, 
                location: stop.location,
                description: stop.description,
                startTime: stop.startTime,
                endTime: stop.endTime
              }))} 
            />
          </div>
        </div>

        {tour.stops.length > 0 && (
          <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Programma</h2>
                <StopsModal stops={tour.stops} />
              </div>
              <p className="mt-4 text-gray-500">Klik op de knop om het volledige programma te bekijken.</p>
            </div>
          </div>
        )}

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

      <div className="bg-background border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <nav className="flex gap-4">
                <DescriptionModal description={tour.description} />
                  <StopsModal stops={tour.stops} />
                  <ContactModal tourTitle={tour.title} />
                </nav>
              </div>
            </div>
          </div>
        </div>
          
    </div>
  )
}
