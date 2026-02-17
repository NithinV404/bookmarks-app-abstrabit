import { supabaseAdmin } from "@/src/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const { data, error } = await supabaseAdmin
      .from("bookmarks")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ bookmarks: data });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      .insert([
        {
          title,
          url,
          is_private: is_private || false,
          user_email: userEmail,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ bookmark: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 },
    );
  }
}
