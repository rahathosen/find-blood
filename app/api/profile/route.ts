import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request: Request) {
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
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { password: _, ...userWithoutPassword } = user; // Explicitly ignore password
    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Profile fetch error:", error.message);
    } else {
      console.error("Profile fetch error:", error);
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
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
    const { name, bloodGroup, age, latitude, longitude } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { name, bloodGroup, age, latitude, longitude },
    });

    const { password: _, ...userWithoutPassword } = updatedUser; // Explicitly ignore password
    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Profile update error:", error.message);
    } else {
      console.error("Profile update error:", error);
    }
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
