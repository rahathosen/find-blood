"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface MessageListProps {
  token: string;
}

export default function MessageList({ token }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!token) throw new Error("No token found");

        const response = await fetch("/api/messages/inbox", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setMessages(data.messages);
        } else {
          throw new Error(data.error || "Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to fetch messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleMessageClick = (senderId: string) => {
    router.push(`/donors/${senderId}?openChat=true`);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card
          key={message.id}
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => handleMessageClick(message.sender.id)}
        >
          <CardContent className="flex items-center p-4">
            <Image
              src={message.sender.avatar || "/placeholder.svg"}
              alt={message.sender.name}
              width={50}
              height={50}
              className="rounded-full mr-4"
            />
            <div className="flex-grow">
              <h3 className="font-semibold">{message.sender.name}</h3>
              <p className="text-sm text-gray-600 truncate">
                {message.content}
              </p>
            </div>
            <div className="text-xs text-gray-400">
              {formatMessageTime(message.createdAt)}
            </div>
          </CardContent>
        </Card>
      ))}
      {messages.length === 0 && (
        <p className="text-center text-gray-500">No messages in your inbox.</p>
      )}
    </div>
  );
}
