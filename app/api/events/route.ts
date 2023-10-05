import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data: eventsData, error } = await supabase
      .from("events")
      .select("*");

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
