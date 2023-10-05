import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Calculate the date one week ago from the current date
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Query for posts older than a week
    const { data: pastPostsData, error: pastPostsError } = await supabase
      .from("posts")
      .select("*")
      .lt('created_at', oneWeekAgo.toISOString()); // Filter for posts older than a week

    if (pastPostsError) {
      console.error("Could not retrieve past posts", pastPostsError);
      return NextResponse.json({ pastPosts: [] });
    }

    // Query for the latest 5 posts
    const { data: latestPostsData, error: latestPostsError } = await supabase
      .from("posts")
      .select("*")
      .order('created_at', { ascending: false }) // Order by created_at in descending order to get the latest posts first
      .limit(5); // Limit the result to the latest 5 posts

    if (latestPostsError) {
      console.error("Could not retrieve latest posts", latestPostsError);
      return NextResponse.json({ latestPosts: [] });
    }

    // Process data for both past and latest posts as needed
    const updatedLatestPostsData = latestPostsData.map((post) => {
      const { data: imageData } = supabase.storage.from("postImages").getPublicUrl(
        `images/${post.group}_${post.date}/${post.image}`
      );
      return { ...post, image: imageData.publicUrl };
    });

    // You can similarly process data for the latest posts if needed

    return NextResponse.json({
      latestPosts: updatedLatestPostsData,
    });
  } catch (error) {
    console.error(`Failed to retrieve posts`, error);
    return NextResponse.error(); // Handle the error appropriately
  }
}
