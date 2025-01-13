"use client";

import { useState } from "react";
import DonorsList from "./DonorsList";
import SearchBar from "./SearchBar";

interface DashboardProps {
  token: string;
}

export default function Dashboard({ token }: DashboardProps) {
  const [searchParams, setSearchParams] = useState({
    query: "",
    bloodGroup: "",
    minAge: "",
    maxAge: "",
  });

  const handleSearch = (params: {
    query: string;
    bloodGroup: string;
    minAge: string;
    maxAge: string;
  }) => {
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Donor Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      <DonorsList searchParams={searchParams} token={token} />
    </div>
  );
}
