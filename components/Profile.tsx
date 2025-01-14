"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileEditForm from "./ProfileEditForm";

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
    return <div className="text-center">Loading profile...</div>;
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
        <ProfileEditForm token={token} initialData={profile} />
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Profile</h2>
      <div className="border rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <Image
            src={profile.avatar || "/placeholder.svg"}
            alt={profile.name}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div>
            <h3 className="text-xl font-semibold">{profile.name}</h3>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm">
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
              {" • "}
              <span className="text-gray-500">
                Last active: {formatLastActive(profile.lastActive)}
              </span>
            </p>
          </div>
        </div>
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
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Edit Profile
      </button>
    </div>
  );
}
