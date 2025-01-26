"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProfileFormData {
  name: string;
  bloodGroup: string;
  age: number;
  presentAddress: string;
  permanentAddress: string;
  profession: string;
  avatar: string;
  phoneNumber: string;
  optionalPhoneNumber: string;
  isPublic: boolean;
  lastDonationDate: Date | null;
}

export default function ProfileEditForm({
  initialData,
  token,
}: {
  initialData: ProfileFormData;
  token: string;
}) {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setFormData({ ...formData, lastDonationDate: date });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/profile");
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="bloodGroup"
          className="block text-sm font-medium text-gray-700"
        >
          Blood Group
        </label>
        <select
          id="bloodGroup"
          name="bloodGroup"
          required
          value={formData.bloodGroup}
          onChange={handleChange}
          className="mt-1 block w-full text-[13px] border   border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700"
        >
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          required
          min="18"
          max="65"
          value={formData.age}
          onChange={handleChange}
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="presentAddress"
          className="block text-sm font-medium text-gray-700"
        >
          Present Address
        </label>
        <input
          type="text"
          id="presentAddress"
          name="presentAddress"
          value={formData.presentAddress}
          onChange={handleChange}
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="permanentAddress"
          className="block text-sm font-medium text-gray-700"
        >
          Permanent Address
        </label>
        <input
          type="text"
          id="permanentAddress"
          name="permanentAddress"
          value={formData.permanentAddress}
          onChange={handleChange}
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="profession"
          className="block text-sm font-medium text-gray-700"
        >
          Profession
        </label>
        <input
          type="text"
          id="profession"
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="optionalPhoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Optional Phone Number
        </label>
        <input
          type="tel"
          id="optionalPhoneNumber"
          name="optionalPhoneNumber"
          value={formData.optionalPhoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full text-[13px] border   border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="avatar"
          className="block text-sm font-medium text-gray-700"
        >
          Avatar URL
        </label>
        <input
          type="url"
          id="avatar"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          className="mt-1 block w-full text-[13px] border   border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="lastDonationDate"
          className="block text-sm font-medium text-gray-700"
        >
          Last Donation Date
        </label>
        <input
          type="date"
          value={
            formData.lastDonationDate
              ? new Date(formData.lastDonationDate).toISOString().split("T")[0]
              : ""
          }
          onChange={handleDateChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isPublic"
          checked={formData.isPublic}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isPublic: checked })
          }
          className={`${
            formData.isPublic ? "bg-green-500" : "bg-yellow-500"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              formData.isPublic ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <Label htmlFor="isPublic">
          <span
            className={`${
              formData.isPublic ? "text-green-600" : "text-yellow-600"
            } font-medium cursor-pointer`}
          >
            {formData.isPublic
              ? "Your profile is Public"
              : "Your profile is Private"}
          </span>
        </Label>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
