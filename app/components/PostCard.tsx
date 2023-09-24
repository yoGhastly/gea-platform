'use client';
import { Button, Chip } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

export const PostCard = () => {
  return (
    <article className="flex flex-col gap-2.5 max-w-sm p-3">
      <div className="relative rounded w-full h-[200px]">
        <Image src="/carousel-image.png" alt="Post" fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <p className="font-bold text-lg">Title</p>
      <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
      <div className="flex justify-between items-center flex-row gap-2">
        <Button variant="solid" color="secondary">Ver mas</Button>
        <Chip variant="light">
          Sep 23, 2023
        </Chip>
      </div>
    </article>
  )
}
