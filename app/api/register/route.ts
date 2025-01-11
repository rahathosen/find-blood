import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch((err) => {
      console.error("Error parsing JSON:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid or empty JSON payload" },
        { status: 400 }
      );
    }

    const { name, email, password, bloodGroup, age, latitude, longitude } =
      body;

    if (
      !name ||
      !email ||
      !password ||
      !bloodGroup ||
      !age ||
      !latitude ||
      !longitude
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Include password
        bloodGroup,
        age: parseInt(age, 10),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    let errorMessage = "Registration failed";

    if (error instanceof Error) {
      errorMessage = error.message;
      console.error(
        "Registration error:",
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      );
    } else {
      console.error("Unknown error:", error);
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
