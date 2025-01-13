import "./globals.css";
import { Inter } from "next/font/google";
import RootLayoutClient from "./RootLayoutClient";
import { cookies } from "next/headers";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blood Donation App",
  description: "Find and register as blood donors",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <RootLayoutClient token={token}>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
