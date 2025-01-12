'use client'

import { useState, useEffect } from 'react'

interface Donor {
  id: string
  name: string
  bloodGroup: string
  age: number
  profession: string
  presentAddress: string
  distance: number
  status: string
  lastActive: string
}

interface DonorsListProps {
  searchParams: {
    query: string
    bloodGroup: string
    minAge: string
    maxAge: string
  }
}

export default function DonorsList({ searchParams }: DonorsListProps) {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No token found')
        }

        const queryParams = new URLSearchParams({
          query: searchParams.query,
          bloodGroup: searchParams.bloodGroup,
          minAge: searchParams.minAge,
          maxAge: searchParams.maxAge,
        }).toString()

        const response = await fetch(`/api/donors?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()

        if (data.success) {
          setDonors(data.donors)
        } else {
          throw new Error(data.error || 'Failed to fetch donors')
        }
      } catch (error) {
        console.error('Error fetching donors:', error)
        setError('Failed to fetch donors. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDonors()
  }, [searchParams])

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`
    }
    return `${distance.toFixed(2)} km`
  }

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive)
    return date.toLocaleString()
  }

  if (loading) {
    return <div className="text-center">Loading donors...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Nearby Donors</h2>
      {donors.length === 0 ? (
        <p>No donors found matching your search criteria.</p>
      ) : (
        <ul className="space-y-4">
          {donors.map((donor) => (
            <li key={donor.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{donor.name}</h3>
                  <p className="text-sm text-gray-600">Blood Group: {donor.bloodGroup}</p>
                  <p className="text-sm text-gray-600">Age: {donor.age}</p>
                  <p className="text-sm text-gray-600">Profession: {donor.profession || 'Not specified'}</p>
                  <p className="text-sm text-gray-600">Address: {donor.presentAddress || 'Not specified'}</p>
                  <p className="text-sm">
                    <span className={`font-bold ${donor.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                      {donor.status.charAt(0).toUpperCase() + donor.status.slice(1)}
                    </span>
                    {' • '}
                    <span className="text-gray-500">
                      Last active: {formatLastActive(donor.lastActive)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatDistance(donor.distance)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

