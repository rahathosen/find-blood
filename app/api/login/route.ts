import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, latitude, longitude } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    // Update user's location, status, and lastActive
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        latitude,
        longitude,
        status: "active",
        lastActive: new Date(),
      },
    });

    const token = jwt.sign(
      { userId: updatedUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Set the JWT token as a cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });

    // Add the token to the cookies
    response.cookies.set("token", token, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Ensure the cookie is secure in production
      maxAge: 86400, // 1 day expiration time
      sameSite: "strict", // Protect against CSRF attacks
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
