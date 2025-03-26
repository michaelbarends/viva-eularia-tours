import { prisma } from '@/lib/prisma'
import TourForm from '../../components/TourForm'
import Navbar from '@/components/Navbar'
import { Tour } from '@/types/tour'

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

  const tourData: Tour = {
    id: tour.id,
    title: tour.title,
    description: tour.description,
    price: tour.price,
    duration: tour.duration,
    location: tour.location,
    maxPeople: tour.maxPeople,
    createdAt: tour.createdAt,
    updatedAt: tour.updatedAt,
    stops: tour.stops.map(stop => ({
      id: stop.id,
      title: stop.title,
      description: stop.description,
      location: stop.location,
      startTime: stop.startTime,
      endTime: stop.endTime,
      order: stop.order,
      tourId: stop.tourId,
      createdAt: stop.createdAt,
      updatedAt: stop.updatedAt
    }))
  }

  return tourData
}

export default async function EditTourPage({ params }: Props) {
  const { id } = await params
  const tour = await getTour(id)

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-center text-gray-500 text-lg">Tour niet gevonden</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <TourForm initialData={tour} />
        </div>
      </div>
    </div>
  )
}
