'use client';

import React, { useEffect, useState } from "react";
import { usePathname } from 'next/navigation'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Avatar } from "@nextui-org/react";
import { Link } from ".";
import Image from "next/image";
import { poppins } from "../fonts";
import { supabase } from "../lib/supabase";

export const Navigation = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const menuItems = [
    "Inicio",
    "Grupos Estudiantiles",
  ];

  useEffect(() => {
    supabase.auth.onAuthStateChange((evt, session) => {
      switch (evt) {
        case "SIGNED_IN":
          setIsSignedIn(true);
          break;
        default:
          setIsSignedIn(false);
          break;
      }
    })
  }, [])


  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBlurred={false} className="border-b border-b-black/20">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="self-start md:-mx-36">
          <Image src="/logo.svg" width={150} height={65} alt="GEA" className="hidden md:block self-start" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4 md:-ml-24" justify="center">
        <NavbarItem isActive={pathname === "/" ? true : false}>
          <Link href="/" className={`${pathname === "/" ? "text-primary" : "text-black"}`}>
            Inicio
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/grupos" ? true : false}>
          <Link href="/grupos" className={`${pathname === "/grupos" ? "text-primary" : "text-black"}`}>
            Grupos Estudiantiles
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent as="div" justify="end" className="md:-mr-28" hidden={isSignedIn}>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name="Jason Hughes"
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              href="#"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
