import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");

  return (
    <div className="flex flex-col items-center sm:px-0 px-4 justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Blood Donation App
          </CardTitle>
          <CardDescription className="text-center">
            {token
              ? "Thank you for being a part of our community!"
              : "Connect with blood donors and save lives"}
          </CardDescription>
        </CardHeader>
        {!token ? (
          <CardContent className="flex flex-col space-y-4">
            <Link
              href="/register"
              type="submit"
              className="w-full py-2 px-4 text-center border border-transparent rounded-md duration-300 shadow-sm text-sm font-medium hover:text-white   hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Register as a Donor
            </Link>

            <Link
              href="/login"
              type="submit"
              className="w-full py-2 px-4 text-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Login
            </Link>
          </CardContent>
        ) : (
          <CardContent className="text-center text-gray-700">
            We appreciate your commitment to saving lives. Explore the app to
            find donors or manage your donations.
          </CardContent>
        )}
      </Card>
    </div>
  );
}
