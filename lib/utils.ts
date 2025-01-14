import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDonationDate(date: Date | string | null | undefined): {
  text: string;
  isRecent: boolean;
} {
  // If the date is a string, parse it into a Date object
  if (typeof date === "string") {
    date = new Date(date.replace(" ", "T")); // Convert to valid ISO format
  }

  // Check if the date is valid
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return { text: "Not Donate Yet!", isRecent: false };
  }

  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  let text = "";
  if (diffInYears > 0) {
    text = `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  } else if (diffInMonths > 0) {
    text = `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  } else if (diffInDays > 0) {
    text = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    text = `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes > 0) {
    text = `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else {
    text = `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
  }

  // Check if the donation is recent (less than 4 months ago)
  const isRecent = diffInMonths < 5;

  return { text, isRecent };
}
