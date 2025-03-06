import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    
    // Valideer de input
    if (!json.email || !json.password) {
      return NextResponse.json(
        { error: 'Email en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }
    
    // Controleer of de gebruiker al bestaat
    const existingUser = await prisma.user.findUnique({
      where: {
        email: json.email
      }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Gebruiker met dit e-mailadres bestaat al' },
        { status: 400 }
      )
    }
    
    // Hash het wachtwoord
    const hashedPassword = await hash(json.password, 12)
    
    // Maak de gebruiker aan
    const user = await prisma.user.create({
      data: {
        email: json.email,
        password: hashedPassword,
        role: json.role || 'user'
      }
    })
    
    // Verwijder het wachtwoord uit de response
    const { password, ...userWithoutPassword } = user
    
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating user' },
      { status: 500 }
    )
  }
}
