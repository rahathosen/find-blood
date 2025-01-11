import Link from 'next/link'
import LoginForm from '@/components/LoginForm'

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
            <LoginForm />
            <div className="mt-6 text-center">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">
                Don&apos;t have an account? Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

