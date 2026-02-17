import { supabaseAdmin } from "@/src/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userEmail = session.user.email;

    const { error } = await supabaseAdmin
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_email", userEmail);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "Bookmark deleted" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, url, is_private } = await request.json();

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 },
      );
    }

    const userEmail = session.user.email;

    const { data, error } = await supabaseAdmin
      .from("bookmarks")
      .update({
        title,
        url,
        is_private: is_private !== undefined ? is_private : false,
      })
      .eq("id", id)
      .eq("user_email", userEmail)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ bookmark: data });
  } catch (error) {
    console.error("Error updating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 },
    );
  }
}
