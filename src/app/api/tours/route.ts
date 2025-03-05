import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        stops: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(tours)
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching tours' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const tour = await prisma.tour.create({
      data: {
        title: json.title,
        description: json.description,
        price: parseFloat(json.price),
        duration: parseInt(json.duration),
        location: json.location,
        maxPeople: parseInt(json.maxPeople),
        stops: {
          create: json.stops?.map((stop: any, index: number) => ({
            title: stop.title,
            description: stop.description,
            location: stop.location,
            duration: parseInt(stop.duration),
            order: index + 1
          })) || []
        }
      },
      include: {
        stops: true
      }
    })
    return NextResponse.json(tour)
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating tour' },
      { status: 500 }
    )
  }
}
