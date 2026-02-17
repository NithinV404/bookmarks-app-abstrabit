"use client";

import { useState } from "react";
import { mutate } from "swr";

export default function AddBookmarkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url, is_private: true }),
      });

      if (res.ok) {
        setTitle("");
        setUrl("");
        mutate("/api/bookmarks"); // Trigger SWR revalidation
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add bookmark");
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
      alert("Failed to add bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Add New Bookmark</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., My Favorite Website"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            htmlFor="url"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Adding...
            </>
          ) : (
            <>
              <span className="text-xl">+</span>
              Add Bookmark
            </>
          )}
        </button>
      </form>
    </div>
  );
}
