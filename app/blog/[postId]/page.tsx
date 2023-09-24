'use client';
import React from "react";
import Link from "next/link";
import { Avatar, Chip, Divider } from "@nextui-org/react";

import "../../styles/post.css";
import Image from "next/image";


export default function Post({ params }: { params: { postId: string } }) {
  return (
    <main className="min-h-screen mb-32">
      <div className="article_layour_header w-full pt-3 px-6 article-hero-bg">
        <div style={{ margin: "0 auto" }} className="max-w-5xl">
          <div className="ml-auto w-auto">
            <div className="pt-2 text-secondary">
              <Link href="/" style={{ transition: "#000 .1s ease" }}>← Volver a Inicio</Link>
            </div>
          </div>

          <div className="mt-16 max-w-4xl">
            <div className="flex gap-5 ">
              <Chip variant="flat"
                classNames={{
                  base: "bg-gradient-to-br from-[#DD5E89] to-[#F7BB97] border-small border-white/50 shadow-pink-500/30",
                  content: "text-black",
                }}
              >
                Grupo Estudiantil
              </Chip>
              <Chip variant="light">
                <p className="text-gray">
                  Saturday, September 23th 2023
                </p>
              </Chip>
            </div>
            <h1 className="text-5xl font-bold mt-6">Asesorias Medio Curso</h1>
            <p className="mt-6 text-lg max-w-md text-gray-300">
              ¡Te compartimos las materias que impartiremos como apoyo para tus exámenes!
              ¡Recuerda estar atento a las fechas que se darán próximamente!
            </p>
          </div>
        </div>
      </div>

      <div style={{ margin: "0 auto" }} className="article-hero-body pt-3 px-6 max-w-4xl grid grid-cols-2">
        <div className="relative rounded w-auto h-[600px] max-w-xl px-6 mt-10 md:ml-20">
          <Image src="/carousel-image.png" alt="Post" fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
            <p className="font-semibold">Mariana</p>
          </div>
        </div>
      </div>
    </main>
  )
}
