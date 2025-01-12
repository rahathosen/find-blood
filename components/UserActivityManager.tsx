"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const INACTIVE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function UserActivityManager() {
  const router = useRouter();
  const lastActivityTime = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdating = useRef<boolean>(false); // Prevent multiple simultaneous updates

  const updateActivity = useCallback(async (status: "active" | "inactive") => {
    const token = localStorage.getItem("token");
    if (!token || isUpdating.current) return; // Skip if no token or already updating

    isUpdating.current = true; // Lock the update process
    try {
      const response = await fetch("/api/update-activity", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update activity");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
    } finally {
      isUpdating.current = false; // Unlock the update process
    }
  }, []);

  const handleActivity = useCallback(() => {
    lastActivityTime.current = Date.now();

    // Debounce frequent activity updates
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const currentTime = Date.now();
      if (currentTime - lastActivityTime.current >= INACTIVE_TIMEOUT) {
        updateActivity("inactive");
      } else {
        updateActivity("active");
      }
    }, INACTIVE_TIMEOUT);
  }, [updateActivity]);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const events = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "mousemove",
    ];

    const attachEvents = () =>
      events.forEach((event) => window.addEventListener(event, handleActivity));
    const detachEvents = () =>
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );

    attachEvents(); // Attach events on mount
    handleActivity(); // Initial activity update

    return detachEvents; // Cleanup on unmount
  }, [handleActivity]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateActivity("inactive");
      } else {
        handleActivity();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleActivity, updateActivity]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      updateActivity("inactive");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [updateActivity]);

  return null;
}
