"use client";

import Link from "next/link";
import UserActivityManager from "@/components/UserActivityManager";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface RootLayoutClientProps {
  children: React.ReactNode;
  token: string; // Add token prop
}

export default function RootLayoutClient({
  children,
  token,
}: RootLayoutClientProps) {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    // If there's a token, attempt to log out on the server
    if (token) {
      try {
        await fetch("/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }

    // Remove token from cookies
    document.cookie = "token=; path=/; max-age=0"; // This removes the cookie by setting its expiration to 0

    // Redirect to the login page
    router.push("/login");
    router.refresh();
  }, [router, token]);

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-md font-bold text-rose-600">
                  Blood
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {token ? (
                <div className="sm:ml-6 sm:flex sm:space-x-8 text-sm font-medium">
                  <Link
                    href="/dashboard"
                    className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/inbox"
                    className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                  >
                    Inbox
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href={"/login"}>
                  <button className="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <UserActivityManager />
      <main>{children}</main>
    </>
  );
}
