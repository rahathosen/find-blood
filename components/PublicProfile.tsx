import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PublicProfileProps {
  user: {
    id: string
    name: string
    bloodGroup: string
    age: number
    profession: string | null
    presentAddress: string | null
    avatar: string | null
    status: string
    lastActive: Date
    gender: string | null
    phoneNumber: string | null
  }
}

export default function PublicProfile({ user }: PublicProfileProps) {
  const formatLastActive = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Image
            src={user.avatar || '/placeholder.svg'}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div>
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.profession || 'Profession not specified'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Blood Group</p>
            <p>{user.bloodGroup}</p>
          </div>
          <div>
            <p className="font-semibold">Age</p>
            <p>{user.age}</p>
          </div>
          <div>
            <p className="font-semibold">Gender</p>
            <p>{user.gender || 'Not specified'}</p>
          </div>
          <div>
            <p className="font-semibold">Phone Number</p>
            <p>{user.phoneNumber || 'Not available'}</p>
          </div>
          <div>
            <p className="font-semibold">Present Address</p>
            <p>{user.presentAddress || 'Not specified'}</p>
          </div>
          <div>
            <p className="font-semibold">Status</p>
            <p className={user.status === 'active' ? 'text-green-500' : 'text-red-500'}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-semibold">Last Active</p>
          <p>{formatLastActive(user.lastActive)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

