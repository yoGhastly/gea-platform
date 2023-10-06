"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { BASE_URL } from "../constants";

interface Group {
  groupImage: string;
  group: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[] | null>(null);

  useEffect(() => {
    const getGroups = async () => {
      const { data: groupsData, error: errorGroups } = await supabase.from("groups").select("*");
      if (errorGroups) {
        console.error(errorGroups);
        setGroups([]);
        return;
      }

      const updatedGroupsData = groupsData.map((group) => {
        const { data: imageData } = supabase.storage.from("profileImages").getPublicUrl(
          `logos/${group.group}/${group.groupImage}`
        );
        return { ...group, groupImage: imageData.publicUrl };
      });

      if (updatedGroupsData.length > 0) {
        console.log(updatedGroupsData);
        setGroups(updatedGroupsData);
      }
    };
    getGroups();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <section className="grid grid-cols-2 gap-10 md:mx-16">
        {groups?.map((group, idx) => (
          <Link
            href={`${BASE_URL}/profile?group=${group.group}`}
            className="w-[150px] h-[150px] md:w-[300px] md:h-[200px] flex flex-col gap-2 justify-center items-center rounded-2xl bg-gray-500 border-2 border-gray p-3"
            key={idx}
          >
            <img
              key={idx}
              src={group.groupImage}
              alt={group.group}
              className="w-full h-full object-contain"
            />
            <p className="font-semibold">{group.group}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
