import Dashboard from "@/components/Dashboard";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  // console.log(token?.value);
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Dashboard token={token?.value || ""} />
      </div>
    </div>
  );
}
