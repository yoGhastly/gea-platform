import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../lib/supabase';

export async function GET() {
  return NextResponse.json({ name: "Diego" })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, postId, image, title, group, description } = body;

    const { error } = await supabase.from("posts").insert([{
      postId,
      date,
      image,
      title,
      group,
      description,
    }])

    if (error) {
      console.error("Failed to save post on db", error);
    }

    return NextResponse.json({ message: "Data received successfully" });
  } catch (error) {
    console.error("Failed to parse request body", error);
  }
}
