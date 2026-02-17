import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import AddBookmarkForm from "../components/AddBookmarkForm";
import BookmarksList from "../components/BookmarksList";
import SignOutButton from "../components/SignOutButton";

export default async function Dashboard() {
    const session = await getServerSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-md">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {session.user?.image && (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    📚 My Bookmarks
                                </h1>
                                <p className="text-sm text-gray-600">{session.user?.email}</p>
                            </div>
                        </div>
                        <SignOutButton />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <AddBookmarkForm />
                </div>

                <BookmarksList />
            </main>
        </div>
    );
}
