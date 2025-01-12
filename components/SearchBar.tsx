'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (searchParams: {
    query: string
    bloodGroup: string
    minAge: string
    maxAge: string
  }) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState({
    query: '',
    bloodGroup: '',
    minAge: '',
    maxAge: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchParams)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          name="query"
          placeholder="Search by name, address, or profession"
          value={searchParams.query}
          onChange={handleChange}
          className="flex-grow px-3 py-2 border rounded-md"
        />
        <select
          name="bloodGroup"
          value={searchParams.bloodGroup}
          onChange={handleChange}
          className="px-3 py-2 border rounded-md"
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
        <input
          type="number"
          name="minAge"
          placeholder="Min Age"
          value={searchParams.minAge}
          onChange={handleChange}
          className="w-24 px-3 py-2 border rounded-md"
        />
        <input
          type="number"
          name="maxAge"
          placeholder="Max Age"
          value={searchParams.maxAge}
          onChange={handleChange}
          className="w-24 px-3 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </form>
  )
}

