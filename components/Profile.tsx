'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  name: string
  email: string
  bloodGroup: string
  age: number
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()

        if (data.success) {
          setProfile(data.user)
        } else {
          throw new Error(data.error || 'Failed to fetch profile')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError('Failed to fetch profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return <div className="text-center">Loading profile...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!profile) {
    return <div className="text-center">No profile data available.</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Profile</h2>
      <div className="border rounded-lg p-4 shadow-sm">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Blood Group:</strong> {profile.bloodGroup}</p>
        <p><strong>Age:</strong> {profile.age}</p>
      </div>
    </div>
  )
}

