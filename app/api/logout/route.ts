import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Mark user as inactive
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        status: "inactive",
        lastActive: new Date(),
      },
    });

    // Clear the token from cookies on logout
    const cookieStore = await cookies();
    cookieStore.delete("token"); // This will remove the 'token' cookie

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
