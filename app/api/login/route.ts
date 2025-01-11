import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' })

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

