import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to Blood Donation App</CardTitle>
          <CardDescription className="text-center">Connect with blood donors and save lives</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/register">
              Register as a Donor
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">
              Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

