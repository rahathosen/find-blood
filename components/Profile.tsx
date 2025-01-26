"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileEditForm from "./ProfileEditForm";
import { Label } from "@/components/ui/label";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bloodGroup: string;
  age: number;
  presentAddress: string;
  permanentAddress: string;
  profession: string;
  avatar: string;
  latitude: number;
  longitude: number;
  status: string;
  lastActive: string;
  gender: string | null;
  phoneNumber: string | null;
  optionalPhoneNumber: string | null;
  isPublic: boolean;
  lastDonationDate: Date | null;
}

export default function Profile({ token }: { token: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setProfile(data.user);
        } else {
          throw new Error(data.error || "Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive);
    return date.toLocaleString();
  };

  function formatDonationDate(date: Date | string | null | undefined): string {
    if (typeof date === "string") {
      date = new Date(date.replace(" ", "T"));
    }
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Not Donate Yet!";
    }
    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <div className="text-center">
        <div className="inline-block w-6 h-6 md:w-8 w md:h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-[14px] md:text-[16px] text-red-500">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center">No profile data available.</div>;
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Edit Your Profile</h2>
        <ProfileEditForm
          token={token}
          initialData={{
            ...profile,
            phoneNumber: profile.phoneNumber || "",
            optionalPhoneNumber: profile.optionalPhoneNumber || "",
          }}
        />
        <button
          onClick={() => setIsEditing(false)}
          className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>

      <div className="border rounded p-6 shadow-md bg-white">
        {/* Profile Header */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8 mb-6">
          <Image
            src={profile.avatar || "/placeholder.png"}
            alt={profile.name}
            width={150}
            height={150}
            className="rounded-full"
          />
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {profile.name}
            </h3>
            <p className="text-gray-500">{profile.email}</p>
            <p className="text-sm mt-1">
              <span
                className={`font-bold ${
                  profile.status === "active"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {profile.status.charAt(0).toUpperCase() +
                  profile.status.slice(1)}
              </span>
              <span className="text-gray-500">
                {" "}
                • Last active: {formatLastActive(profile.lastActive)}
              </span>
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700">
          <p>
            <strong>Blood Group:</strong> {profile.bloodGroup}
          </p>
          <p>
            <strong>Last Donation Date:</strong>{" "}
            {formatDonationDate(profile.lastDonationDate)}
          </p>
          <p>
            <strong>Age:</strong> {profile.age}
          </p>
          <p>
            <strong>Present Address:</strong>{" "}
            {profile.presentAddress || "Not specified"}
          </p>
          <p>
            <strong>Permanent Address:</strong>{" "}
            {profile.permanentAddress || "Not specified"}
          </p>
          <p>
            <strong>Profession:</strong> {profile.profession || "Not specified"}
          </p>
          <p>
            <strong>Gender:</strong> {profile.gender || "Not specified"}
          </p>
          <p>
            <strong>Phone Number:</strong>{" "}
            {profile.phoneNumber || "Not specified"}
          </p>
          <p>
            <strong>Optional Phone Number:</strong>{" "}
            {profile.optionalPhoneNumber || "Not specified"}
          </p>
          <p>
            <strong>Location:</strong> Latitude: {profile.latitude.toFixed(6)},
            Longitude: {profile.longitude.toFixed(6)}
          </p>
        </div>

        {/* Profile Visibility */}
        <div className="mt-6 text-sm">
          <Label htmlFor="isPublic">
            <span
              className={`${
                profile.isPublic ? "text-green-600" : "text-yellow-600"
              } font-medium`}
            >
              {profile.isPublic
                ? "Your profile is Public"
                : "Your profile is Private"}
            </span>
          </Label>
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={() => setIsEditing(true)}
        className="py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Edit Profile
      </button>
    </div>
  );
}
