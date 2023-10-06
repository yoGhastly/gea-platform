import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <footer className="flex flex-nowrap md:flex-wrap h-24 w-full items-center justify-center border-t">
      <p className="text-primary text-center">
        © 2023 Derechos Reservados. Elaborado por{" "}
        <Link href="https://www.instagram.com/xervsware/" className="font-bold">
          Xervsware
        </Link>
      </p>
    </footer>
  );
};
