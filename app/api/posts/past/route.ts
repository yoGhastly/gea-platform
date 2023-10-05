import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Calculate the date one week ago from the current date
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: postsData, error } = await supabase
      .from("posts")
      .select("*")
      .lt('created_at', oneWeekAgo.toISOString()); // Filter for posts older than a week

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

    return NextResponse.json({ pastPosts: updatedPostsData });
  } catch (error) {
    console.error(`Failed to retrieve posts`, error);
    return NextResponse.error(); // Handle the error appropriately
  }
}
