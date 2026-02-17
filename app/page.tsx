import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();

  // Redirect to dashboard if already logged in
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
        <div className="mb-4 text-6xl">🔖</div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Bookmarks App
        </h1>
        <p className="mb-8 text-gray-600">
          Organize and manage your bookmarks with ease. Save URLs with privacy controls using Google OAuth.
        </p>

        <Link
          href="/login"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

