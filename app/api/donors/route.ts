import { NextResponse } from "next/server";
import { PrismaClient, User } from "@prisma/client";
import { haversineDistance } from "../../utils/haversine";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = parseFloat(searchParams.get("latitude") || "");
    const longitude = parseFloat(searchParams.get("longitude") || "");

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { success: false, error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    const donors = await prisma.user.findMany();

    const donorsWithDistance = donors.map((donor: User) => ({
      ...donor,
      distance: haversineDistance(
        latitude,
        longitude,
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
