"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg bg-red-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-600"
        >
            Sign Out
        </button>
    );
}
