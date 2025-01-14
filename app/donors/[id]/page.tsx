import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import PublicProfile from "@/components/PublicProfile";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Define the type for params as a Promise
type Params = Promise<{ id: string }>;

export default async function DonorProfilePage({ params }: { params: Params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>Please log in to view this page.</div>;
  }

  let currentUserId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as {
      userId: string;
    };
    currentUserId = decoded.userId;
  } catch (error) {
    console.error("Error verifying token:", error);
    return <div>Authentication error. Please log in again.</div>;
  }

  // Await the params to extract id
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      bloodGroup: true,
      age: true,
      profession: true,
      presentAddress: true,
      avatar: true,
      status: true,
      lastActive: true,
      gender: true,
      phoneNumber: true,
      optionalPhoneNumber: true,
      lastDonationDate: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Donor Profile</h1>
      <PublicProfile user={user} currentUserId={currentUserId} />
    </div>
  );
}
