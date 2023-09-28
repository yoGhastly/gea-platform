import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data: postsData, error } = await supabase.from("posts").select("*");

    if (!postsData || error) {
      console.error("Could not retrieve posts", error);
      return NextResponse.json({ posts: [] });
    }

    const updatedPostsData = postsData.map((post) => {
      const { data: imageData } = supabase.storage.from("postImages").getPublicUrl(
        `images/${post.group}_${post.date}/${post.image}`
      );
      return { ...post, image: imageData.publicUrl };
    });

    return NextResponse.json({ posts: updatedPostsData });
  } catch (error) {
    console.error(`Failed to retrieve posts`, error);
    return NextResponse.error(); // Handle the error appropriately
  }
}
