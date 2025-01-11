import Link from 'next/link'
import RegistrationForm from '@/components/RegistrationForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-center">Blood Donation App</h1>
            <RegistrationForm />
            <div className="mt-6 text-center">
              <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

