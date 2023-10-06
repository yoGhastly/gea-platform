"use client";
import { Button, Chip } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { Post } from "../interfaces";
import { BASE_URL } from "../constants";
interface Props {
  post: Post;
}
export const PostCard: React.FC<Props> = ({ post }) => {
  return (
    <article className="flex flex-col justify-center gap-2.5 w-[330px] md:w-full md:max-w-sm p-3">
      <div className="relative rounded w-[300px] md:w-[300px] h-[200px]">
        <Image
          src={post.image}
          alt="Post"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <p className="font-bold text-lg">{post.title}</p>
      <Button
        variant="solid"
        color="secondary"
        as="a"
        href={`${BASE_URL}/blog/${post.postId}`}
      >
        Ver mas
      </Button>
    </article>
  );
};
