"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Bookmark {
  id: number;
  title: string;
  url: string;
  is_private: boolean;
  created_at: string;
}

export default function BookmarksList() {
  const { data, error, isLoading } = useSWR("/api/bookmarks", fetcher, {
    refreshInterval: 3000, // Poll every 3 seconds for real-time updates
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editIsPrivate, setEditIsPrivate] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;

    try {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        mutate("/api/bookmarks");
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      alert("Failed to delete bookmark");
    }
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
    setEditIsPrivate(bookmark.is_private);
  };

  const handleUpdate = async (id: number) => {
    if (!editTitle.trim() || !editUrl.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, url: editUrl, is_private: editIsPrivate }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditTitle("");
        setEditUrl("");
        setEditIsPrivate(false);
        mutate("/api/bookmarks");
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
      alert("Failed to update bookmark");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setEditIsPrivate(false);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading bookmarks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Failed to load bookmarks. Please try again.
      </div>
    );
  }

  const bookmarks: Bookmark[] = data?.bookmarks || [];

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-lg bg-white py-12 text-center shadow-lg">
        <div className="mb-4 text-6xl">🔖</div>
        <p className="text-xl text-gray-600">
          No bookmarks yet. Add your first one above!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-200 hover:shadow-xl"
        >
          {editingId === bookmark.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Title"
              />
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="URL"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editIsPrivate}
                  onChange={(e) => setEditIsPrivate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  id={`edit-private-${bookmark.id}`}
                />
                <label htmlFor={`edit-private-${bookmark.id}`} className="ml-2 text-sm text-gray-700">
                  Private
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(bookmark.id)}
                  className="flex-1 rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 rounded-lg bg-gray-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="truncate text-lg font-semibold text-gray-900">
                  {bookmark.title}
                </h3>
                {bookmark.is_private && (
                  <span className="flex-shrink-0 rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                    🔒 Private
                  </span>
                )}
              </div>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 block break-all text-sm text-blue-600 hover:underline"
              >
                {bookmark.url}
              </a>
              <div className="mb-4 text-xs text-gray-500">
                {new Date(bookmark.created_at).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(bookmark)}
                  className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(bookmark.id)}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
