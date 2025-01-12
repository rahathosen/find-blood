import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ success: false, error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const { status } = await request.json()

    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        status: status,
        lastActive: new Date(),
      },
    })

    return NextResponse.json({ success: true, message: 'Activity updated successfully' })
  } catch (error) {
    console.error('Update activity error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update activity' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

