import Profile from "@/components/Profile";
import { cookies } from "next/headers";
export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <Profile token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}
