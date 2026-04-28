import LoginForm from "@/src/components/auth/LoginForm"
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Log in to your account</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?
          <Link href="/signup" className="text-gray-900 font-medium hover:underline pl-1">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}