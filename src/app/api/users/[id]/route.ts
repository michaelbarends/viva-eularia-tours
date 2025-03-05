import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id)
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const json = await request.json()

    // Valideer de input
    if (!json.email?.trim()) {
      return NextResponse.json({ error: 'Email is verplicht' }, { status: 400 })
    }
    if (!json.role?.trim()) {
      return NextResponse.json({ error: 'Rol is verplicht' }, { status: 400 })
    }

    // Update de gebruiker
    const user = await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: {
        email: json.email,
        role: json.role
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error updating user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    await prisma.user.delete({
      where: {
        id: parseInt(id)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error deleting user' },
      { status: 500 }
    )
  }
}
