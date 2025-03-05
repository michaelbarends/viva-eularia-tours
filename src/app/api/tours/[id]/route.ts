import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Stop, Tour } from '@/types/tour'

interface TourUpdateData {
  title: string
  description: string
  price: string
  duration: string
  location: string
  maxPeople: string
  stops?: Stop[]
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context
  try {
    const { id } = params
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
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tour)
  } catch (error: unknown) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching tour' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context
  try {
    const { id } = params
    const json = await request.json() as TourUpdateData
    
    // First delete all existing stops
    await prisma.stop.deleteMany({
      where: {
        tourId: parseInt(id)
      }
    })

    // Then update the tour with new data and stops
    const tour = await prisma.tour.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title: json.title,
        description: json.description,
        price: parseFloat(json.price),
        duration: parseInt(json.duration),
        location: json.location,
        maxPeople: parseInt(json.maxPeople),
        stops: {
          create: json.stops?.map((stop: Stop, index: number) => ({
            title: stop.title,
            description: stop.description,
            location: stop.location,
            duration: parseInt(stop.duration),
            order: index + 1
          })) || []
        }
      },
      include: {
        stops: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json(tour)
  } catch (error: unknown) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error updating tour' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context
  try {
    const { id } = params
    await prisma.tour.delete({
      where: {
        id: parseInt(id)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error deleting tour' },
      { status: 500 }
    )
  }
}
