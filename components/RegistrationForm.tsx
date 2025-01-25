"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FormDataType } from "@/types/index.type";

export default function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataType>();
  const router = useRouter();

  const onSubmit = async (data: FormDataType) => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          password: hashedPassword,
          latitude,
          longitude,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        router.push("/login");
      } else {
        throw new Error(responseData.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          {...register("name", { required: "Name is required" })}
          placeholder="Name..."
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
        {errors.name && (
          <p className="text-red-500 text-[12px]">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          placeholder="Email..."
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-[12px]">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            })}
            placeholder="Password..."
            className="block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-[12px]">{errors.password.message}</p>
        )}
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
          {...register("bloodGroup", { required: "Blood group is required" })}
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
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
        {errors.bloodGroup && (
          <p className="text-red-500 text-[12px]">
            {errors.bloodGroup.message}
          </p>
        )}
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
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^\d{11}$/,
              message: "Phone number must be 11 digits",
            },
          })}
          placeholder="Number..."
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-[12px]">
            {errors.phoneNumber.message}
          </p>
        )}
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
          {...register("age", {
            required: "Age is required",
            min: { value: 18, message: "Age can't be less than 18" },
          })}
          placeholder="18"
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        />
        {errors.age && (
          <p className="text-red-500 text-[12px]">{errors.age.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          Gender
        </label>
        <select
          id="gender"
          {...register("gender", { required: "Gender is required" })}
          className="mt-1 block w-full border text-[14px] border-gray-300 rounded px-2 py-1 shadow-sm outline-none"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-[12px]">{errors.gender.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Register
      </button>
    </form>
  );
}
