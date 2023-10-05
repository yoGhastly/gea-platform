"use client";
import { Button, Chip } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { Post } from "../interfaces";
interface Props {
  post: Post;
}
export const PostCard: React.FC<Props> = ({ post }) => {
  return (
    <article className="flex flex-col gap-2.5 max-w-sm p-3">
      <div className="relative rounded w-full h-[200px]">
        <Image
          src={post.image}
          alt="Post"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <p className="font-bold text-lg">{post.title}</p>
      <p>{post.title}</p>
      <div className="flex justify-between items-center flex-row gap-2">
        <Button
          variant="solid"
          color="secondary"
          as="a"
          href={`${window.origin}/blog/${post.postId}`}
        >
          Ver mas
        </Button>
        <Chip variant="light">{post.date}</Chip>
      </div>
    </article>
  );
};
