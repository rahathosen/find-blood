import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import PublicProfile from "@/components/PublicProfile";

const prisma = new PrismaClient();

export async function generateStaticParams() {
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  return users.map((user) => ({
    id: user.id,
  }));
}

// Correctly define the function signature
export default async function DonorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>; // Change here to match expected type
}) {
  const resolvedParams = await params; // Await the params
  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
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
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Donor Profile</h1>
      <PublicProfile user={user} />
    </div>
  );
}
