import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data: groupsData, error } = await supabase.from("groups").select("*");

    if (!groupsData || error) {
      console.error("Could not retrieve groups", error);
      return NextResponse.json({ posts: [] });
    }

    const updatedGroupsData = groupsData.map((group) => {
      const { data: imageData } = supabase.storage.from("profileImages").getPublicUrl(
        `logos/${group.group}/${group.groupImage}`
      );
      return { ...group, groupImage: imageData.publicUrl };
    });

    return NextResponse.json({ groups: updatedGroupsData });
  } catch (error) {
    console.error(`Failed to retrieve posts`, error);
    return NextResponse.error(); // Handle the error appropriately
  }
}
