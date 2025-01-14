import MessageList from "@/components/MessageList";
import { cookies } from "next/headers";
export default async function InboxPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Inbox</h1>
      <MessageList token={token?.value || ""} />
    </div>
  );
}
