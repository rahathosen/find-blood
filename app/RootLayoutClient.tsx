"use client";

import Link from "next/link";
import UserActivityManager from "@/components/UserActivityManager";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface RootLayoutClientProps {
  children: React.ReactNode;
  token: string; // Add token prop
}

export default function RootLayoutClient({
  children,
  token,
}: RootLayoutClientProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
            <div className="flex   justify-between">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-md font-bold text-rose-600">
                  Blood
                </Link>
              </div>
            </div>
            <div className=" hidden sm:flex items-center">
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

            <div className="flex items-center sm:hidden">
              <button onClick={toggleSidebar} className="text-gray-900">
                {isSidebarOpen ? "" : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 sm:hidden`}
      >
        <div className="bg-white w-64 h-full shadow-lg absolute right-0">
          <div className="flex justify-between items-center p-4">
            <button onClick={toggleSidebar} className="text-gray-900">
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4 px-4">
            <Link
              href="/dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className="block text-gray-900   rounded-md"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              onClick={() => setIsSidebarOpen(false)}
              className="block text-gray-900   rounded-md"
            >
              Profile
            </Link>
            <Link
              href="/inbox"
              onClick={() => setIsSidebarOpen(false)}
              className="block text-gray-900   rounded-md"
            >
              Inbox
            </Link>
            <Link href="/login" onClick={() => setIsSidebarOpen(false)}>
              <button className="block w-full text-left text-gray-900 pt-3   rounded-md">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
      <UserActivityManager />
      <main>{children}</main>
    </>
  );
}
