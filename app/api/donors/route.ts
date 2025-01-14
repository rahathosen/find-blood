import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { haversineDistance } from "../../utils/haversine";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
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
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const searchQuery = searchParams.get("query") || "";
    const bloodGroup = searchParams.get("bloodGroup") || undefined;
    const minAge = parseInt(searchParams.get("minAge") || "0");
    const maxAge = parseInt(searchParams.get("maxAge") || "150");

    const donors = await prisma.user.findMany({
      where: {
        id: { not: currentUser.id },
        isPublic: true, // Only fetch public profiles
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { presentAddress: { contains: searchQuery, mode: "insensitive" } },
          { permanentAddress: { contains: searchQuery, mode: "insensitive" } },
          { profession: { contains: searchQuery, mode: "insensitive" } },
        ],
        bloodGroup: bloodGroup,
        age: {
          gte: minAge,
          lte: maxAge,
        },
      },
      select: {
        id: true,
        name: true,
        bloodGroup: true,
        age: true,
        profession: true,
        presentAddress: true,
        latitude: true,
        longitude: true,
        status: true,
        lastActive: true,
        lastDonationDate: true,
      },
    });

    const donorsWithDistance = donors.map((donor) => ({
      ...donor,
      distance: haversineDistance(
        currentUser.latitude,
        currentUser.longitude,
        donor.latitude,
        donor.longitude
      ),
    }));

    const sortedDonors = donorsWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    return NextResponse.json({ success: true, donors: sortedDonors });
  } catch (error) {
    console.error("Error fetching donors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donors" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
