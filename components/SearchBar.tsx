"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (searchParams: {
    query: string;
    bloodGroup: string;
    minAge: string;
    maxAge: string;
  }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState({
    query: "",
    bloodGroup: "",
    minAge: "",
    maxAge: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="flex flex-wrap items-center gap-3 md:gap-4 md:flex-nowrap">
        {/* Search Input */}
        <input
          type="text"
          name="query"
          placeholder="Search by name, address, or profession"
          value={searchParams.query}
          onChange={handleChange}
          className="flex-grow px-3 text-[13px] outline-none md:text-[14px] py-2 border rounded-md"
        />

        {/* Blood Group Select */}
        <select
          name="bloodGroup"
          value={searchParams.bloodGroup}
          onChange={handleChange}
          className="px-3 w-full py-2 border text-[13px] md:text-[14px] rounded-md outline-none md:w-48"
        >
          <option value="">All Blood Groups</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        {/* Min Age and Max Age Inputs */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minAge"
            placeholder="Min Age"
            value={searchParams.minAge}
            onChange={handleChange}
            className="w-full md:w-24 px-3 py-2 border text-[12px] outline-none rounded-md"
          />
          <input
            type="number"
            name="maxAge"
            placeholder="Max Age"
            value={searchParams.maxAge}
            onChange={handleChange}
            className="w-full md:w-24 px-3 py-2 text-[12px] border rounded-md outline-none"
          />
          {/* Search Button */}
          <button
            type="submit"
            className="px-4 md:hidden block py-2 text-[13px] md:text-[14px] bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Search
          </button>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-4 md:block hidden py-2 text-[13px] md:text-[14px] bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Search
        </button>
      </div>
    </form>
  );
}
