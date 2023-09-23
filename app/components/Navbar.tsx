import Image from "next/image";
import React from "react";
import { Link } from ".";

export const Navbar = () => {
  return (
    <div className="flex py-0 px-24 mb-4">
      <div className="z-10 w-full h-20 flex gap-10 flex-col space-x-72 items-center lg:flex-row lg:border-b lg:border-b-black/20">
        <figure className="max-w-md lg:w-auto lg:rounded-xl">
          <Image src="/logo.svg" width={150} height={80} alt='GEA' />
        </figure>
        <div className="flex flex-col lg:flex-row gap-10 h-48  w-full lg:w-auto lg:items-center lg:static lg:h-auto lg:bg-none">
          <Link href='/'>Inicio</Link>
          <Link href='/grupos'>Grupos Estudiantiles</Link>
        </div>
        <div></div>
      </div>
    </div>
  )
}
