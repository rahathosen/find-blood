"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDonationDate } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  age: number;
  profession: string;
  presentAddress: string;
  distance: number;
  status: string;
  lastActive: string;
  lastDonationDate: string | null;
  isPublic: boolean;
}

interface DonorsListProps {
  searchParams: {
    query: string;
    bloodGroup: string;
    minAge: string;
    maxAge: string;
  };
  token: string;
}

export default function DonorsList({ searchParams, token }: DonorsListProps) {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        if (!token) {
          throw new Error("No token found");
        }
        const queryParams = new URLSearchParams({
          query: searchParams.query,
          bloodGroup: searchParams.bloodGroup,
          minAge: searchParams.minAge,
          maxAge: searchParams.maxAge,
        }).toString();

        const response = await fetch(`/api/donors?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setDonors(data.donors);
        } else {
          throw new Error(data.error || "Failed to fetch donors");
        }
      } catch (error) {
        console.error("Error fetching donors:", error);
        setError("You should Login to see Donors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [searchParams]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonors = donors.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} meters away`;
    }
    return `${distance.toFixed(2)} km away`;
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="inline-block w-6 h-6 md:w-8 w md:h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-[14px] md:text-[16px] text-red-500">
          Loading donors...
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Nearby Donors</h2>
      {currentDonors.length === 0 ? (
        <p>No donors found matching your search criteria.</p>
      ) : (
        <ul className="space-y-4">
          {currentDonors.map((donor) => (
            <li key={donor.id} className="border rounded-lg p-2 shadow-sm">
              <Link
                href={`/donors/${donor.id}`}
                className="block hover:bg-gray-50 p-4 rounded-md transition duration-150 ease-in-out"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{donor.name}</h3>
                    <p className="text-sm text-gray-600">
                      Blood Group: {donor.bloodGroup}
                    </p>
                    <p className="text-sm text-gray-600">Age: {donor.age}</p>
                    <p className="text-sm text-gray-600">
                      Profession: {donor.profession || "Not specified"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Address: {donor.presentAddress || "Not specified"}
                    </p>
                    <p className="text-sm">
                      <span
                        className={`font-bold ${
                          donor.status === "active"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {donor.status.charAt(0).toUpperCase() +
                          donor.status.slice(1)}
                      </span>
                      {" • "}
                      <span className="text-gray-500">
                        Last active: {formatDonationDate(donor.lastActive).text}
                      </span>
                    </p>
                    <p className="text-sm text-gray-800">
                      Last Donation:{" "}
                      {formatDonationDate(donor.lastDonationDate).text}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDistance(donor.distance)}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              href="#"
            />
          </PaginationItem>
          {Array.from(
            { length: Math.ceil(donors.length / itemsPerPage) },
            (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => paginate(i + 1)}
                  href="#"
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(donors.length / itemsPerPage))
                )
              }
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
