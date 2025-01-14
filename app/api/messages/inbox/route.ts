import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const messages = await prisma.message.findMany({
      where: {
        receiverId: decoded.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      distinct: ["senderId"],
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching inbox messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inbox messages" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
