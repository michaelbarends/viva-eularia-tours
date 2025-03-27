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
    <>
      <header className="bg-background border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center items-center">
            <img src="/viva-eularia-logo.svg" alt="Viva Eularia" className="h-8" />
          </div>
        </div>
      </header>

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

      <footer className="bg-background px-4 shadow-lg rounded-lg absolute bottom-0 sm:bottom-6 margin-0 auto sm:w-9/12 sm:right-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        
          <div className="flex items-center justify-between h-16">
            <nav className="flex gap-4">
              <DescriptionModal description={tour.description} />
              <StopsModal stops={tour.stops} />
              <ContactModal tourTitle={tour.title} />
            </nav>
            <div className="hidden lg:flex">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} Viva Eularia | <a href="http://vivaeularia.com/" target="_blank" className="text-sm text-primary hover:text-primary/80">www.vivaeularia.com</a></p>
            </div>
          </div>
      
      </footer>
    
    </>
  )
}
