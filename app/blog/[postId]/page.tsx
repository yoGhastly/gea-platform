"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Chip, Divider } from "@nextui-org/react";

import "../../styles/post.css";
import Image from "next/image";
import { HeaderGradient } from "@/app/components";
import { supabase } from "@/app/lib/supabase";

interface Post {
  postId: string;
  date: string;
  title: string;
  image: string;
  created_at: string;
  group: string;
  description: string;
}

export default function Post({ params }: { params: { postId: string } }) {
  const [postDetails, setPostDetails] = useState<Post | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [presidentName, setPresidentName] = useState("");

  useEffect(() => {
    if (!params.postId) return;
    const getPost = async () => {
      const { data: postData, error } = await supabase
        .from("posts")
        .select("*")
        .eq("postId", params.postId);

      const { data: imageData } = supabase.storage
        .from("postImages")
        .getPublicUrl(
          `images/${postData![0]?.group}_${postData![0]?.date}/${postData![0]?.image}`
        );
      console.log(imageData.publicUrl);

      const { data: groupData, error: errorGroup } = await supabase
        .from("groups")
        .select("*")
        .eq("group", postData![0]?.group);

      if (error && errorGroup) {
        console.error(
          `Failed to retrieve post with ID ${params.postId}`,
          error
        );

        console.error(`Failed to retrieve group`, errorGroup);
        return;
      }

      if (postData && imageData && groupData) {
        setPostDetails(postData[0]);
        setImageSrc(imageData.publicUrl);
        setPresidentName(groupData[0]?.presidentName);
      }
    };
    getPost();
  }, [params.postId]);

  return (
    <main className="min-h-screen mb-32">
      <HeaderGradient>
        <div style={{ margin: "0 auto" }} className="max-w-5xl">
          <div className="ml-auto w-auto">
            <div className="pt-2 text-secondary">
              <Link href="/" style={{ transition: "#000 .1s ease" }}>
                ← Volver a Inicio
              </Link>
            </div>
          </div>

          <div className="mt-16 max-w-4xl">
            <div className="flex gap-5 ">
              <Chip
                variant="flat"
                classNames={{
                  base: "bg-gradient-to-br from-[#DD5E89] to-[#F7BB97] border-small border-white/50 shadow-pink-500/30",
                  content: "text-black",
                }}
              >
                {postDetails?.group}
              </Chip>
              <Chip variant="light">
                <p className="text-gray">{postDetails?.date.match(/(\d{2}_\d{2}_\d{4})/)![0].replace(/_/g, " ")}</p>
              </Chip>
            </div>
            <h1 className="text-5xl font-bold mt-6">{postDetails?.title}</h1>
            <p className="mt-6 text-lg max-w-md text-gray-300">
              {postDetails?.description}
            </p>
          </div>
        </div>
      </HeaderGradient>

      <div
        style={{ margin: "0 auto" }}
        className="article-hero-body pt-3 px-6 max-w-4xl md:grid flex flex-col md:grid-cols-2"
      >
        <div className="relative rounded w-auto h-[600px] max-w-xl px-6 mt-10 md:ml-20 overflow-hidden">
          <Image
            src={imageSrc}
            alt="Post"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
        </div>
        <div className="flex gap-8">
          <Divider orientation="vertical" />
          <div className="flex justify-center gap-5 mt-6">
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={presidentName}
              size="sm"
            />
            <p className="font-semibold">{presidentName}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
