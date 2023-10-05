import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data: adminEmails, error } = await supabase
      .from("admin email")
      .select("email");

    if (!eventsData || error) {
      console.error("Could not retrieve events", error);
      return NextResponse.json({ posts: [] });
    }

    return NextResponse.json({ events: eventsData });
  } catch (error) {
    console.error(`Failed to retrieve posts`, error);
    return NextResponse.error(); // Handle the error appropriately
  }
}
