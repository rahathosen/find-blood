import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, bloodGroup, age, latitude, longitude } = await request.json()

    const user = await prisma.user.create({
      data: {
        name,
        bloodGroup,
        age: parseInt(age),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

