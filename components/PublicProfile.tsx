"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { formatDonationDate } from "@/lib/utils";

interface PublicProfileProps {
  user: {
    id: string;
    name: string;
    bloodGroup: string;
    age: number;
    profession: string | null;
    presentAddress: string | null;
    avatar: string | null;
    status: string;
    lastActive: Date;
    gender: string | null;
    phoneNumber: string | null;
    lastDonationDate: Date | null;
  };
  currentUserId: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

export default function PublicProfile({
  user,
  currentUserId,
}: PublicProfileProps) {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/messages?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [user.id]);

  useEffect(() => {
    if (showChat) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId);
    }
  }, [showChat, fetchMessages]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        content: newMessage,
        receiverId: user.id,
      };

      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(message),
        });

        const data = await response.json();

        if (data.success) {
          setNewMessage("");
          fetchMessages(); // Fetch messages immediately after sending
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const formatLastActive = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div>
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">
              {user.profession || "Profession not specified"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Blood Group</p>
            <p>{user.bloodGroup}</p>
          </div>
          <div>
            <p className="font-semibold">Age</p>
            <p>{user.age}</p>
          </div>
          <div>
            <p className="font-semibold">Gender</p>
            <p>{user.gender || "Not specified"}</p>
          </div>
          <div>
            <p className="font-semibold">Phone Number</p>
            <p>{user.phoneNumber || "Not available"}</p>
          </div>
          <div>
            <p className="font-semibold">Present Address</p>
            <p>{user.presentAddress || "Not specified"}</p>
          </div>
          <div>
            <p className="font-semibold">Status</p>
            <p
              className={
                user.status === "active" ? "text-green-500" : "text-red-500"
              }
            >
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </p>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Last Donation Date</p>
            <div className="flex items-center space-x-2">
              <p
                className={
                  formatDonationDate(user.lastDonationDate).isRecent
                    ? "text-red-500"
                    : ""
                }
              >
                {formatDonationDate(user.lastDonationDate).text}
              </p>
              {formatDonationDate(user.lastDonationDate).isRecent && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <QuestionMarkCircledIcon className="h-4 w-4 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center">
                      <p className="">
                        Less than 5 months is not ideal condition for new
                        donation.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold">Last Active</p>
            <p>{formatLastActive(user.lastActive)}</p>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={() => setShowChat(!showChat)}>
            {showChat ? "Hide Chat" : "Show Chat"}
          </Button>
        </div>
        {showChat && (
          <div className="mt-4">
            <div className="h-64 overflow-y-auto border rounded p-2 mb-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 ${
                    message.senderId === currentUserId
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded ${
                      message.senderId === currentUserId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {message.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow mr-2"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
