'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Donor {
  id: string
  name: string
  bloodGroup: string
  age: number
  distance: number
}

export default function Dashboard() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const position = await getCurrentPosition()
        const { latitude, longitude } = position.coords

        const response = await fetch(`/api/donors?latitude=${latitude}&longitude=${longitude}`, {
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
  }, [router])

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`
    }
    return `${distance.toFixed(2)} km`
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
        <p>No donors found nearby.</p>
      ) : (
        <ul className="space-y-2">
          {donors.map((donor) => (
            <li key={donor.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{donor.name}</h3>
                  <p className="text-sm text-gray-600">Blood Group: {donor.bloodGroup}</p>
                  <p className="text-sm text-gray-600">Age: {donor.age}</p>
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

