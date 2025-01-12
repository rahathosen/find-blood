"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";

const INACTIVE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const DEBOUNCE_DELAY = 2000; // Debounce API calls every 2 seconds

export default function UserActivityManager() {
  const router = useRouter();
  const lastActivityTime = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced updateActivity function to prevent frequent API calls
  const updateActivity = useCallback(
    debounce(async (status: "active" | "inactive") => {
      const token = localStorage.getItem("token");
      if (!token) return;

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
      }
    }, DEBOUNCE_DELAY),
    []
  );

  const handleActivity = useCallback(() => {
    lastActivityTime.current = Date.now();

    // Only update activity as 'active' after debounce
    updateActivity("active");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a timeout to mark user as 'inactive' after the timeout period
    timeoutRef.current = setTimeout(() => {
      const currentTime = Date.now();
      if (currentTime - lastActivityTime.current >= INACTIVE_TIMEOUT) {
        updateActivity("inactive");
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
    events.forEach((event) => window.addEventListener(event, handleActivity));

    handleActivity(); // Initial activity update

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
