"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Group {
  groupImage: string;
  group: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[] | null>(null);

  useEffect(() => {
    const getGroups = async () => {
      const res = await fetch(`${window.origin}/api/groups`, {
        method: "GET",
        next: { revalidate: 3600 }
      });

      const { groups } = await res.json();
      setGroups(groups);
    };
    getGroups();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <section className="grid grid-cols-2 gap-10 md:mx-16">
        {groups?.map((group, idx) => (
          <Link
            href={`${window.origin}/profile?group=${group.group}`}
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
