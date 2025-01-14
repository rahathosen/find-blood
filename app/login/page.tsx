import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Login() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");

  // Redirect to dashboard if the user is already logged in
  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <h2 className="font-normal text-sm text-zinc-600">
            Didn't Member yet!
            <Link href={"/register"}>
              <span className="font-bold text-zinc-800"> Register </span>
            </Link>
            Now
          </h2>
        </CardFooter>
      </Card>
    </div>
  );
}
