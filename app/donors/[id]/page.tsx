import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import PublicProfile from "@/components/PublicProfile";

const prisma = new PrismaClient();

export default async function DonorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params; // Explicitly await params if necessary

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
