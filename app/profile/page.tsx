"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import { HeaderGradient } from "../components";
import Image from "next/image";
import { Button, Divider, Tab, Tabs } from "@nextui-org/react";
import Link from "next/link";

export interface Profile {
  id: string;
  created_at: string;
  group: string;
  presidentName: string;
  groupImage: string;
  bio: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
}

export default function Profile() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const [profileDetails, setProfileDetails] = useState<Profile | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [tabSelected, setTabSelected] = useState("Posts");
  const [emailGroup, setEmailGroup] = useState("");

  useEffect(() => {
    if (!searchParams.has("group")) {
      push("/");
    } else {
      const group = searchParams.get("group");

      const fetchProfileData = async () => {
        try {
          const { data, error } = await supabase
            .from("groups")
            .select("*")
            .eq("group", group);

          if (error) {
            throw error;
          }

          setProfileDetails(data[0]);

          const { data: emailGroupsData, error: errorEmailGroups } =
            await supabase
              .from("emailGroups")
              .select("email")
              .eq("group", data![0]?.group);
          if (errorEmailGroups) {
            throw errorEmailGroups;
          }

          if (!data) return;
          setEmailGroup(emailGroupsData![0]?.email);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      fetchProfileData();
    }
  }, [push, searchParams]);

  useEffect(() => {
    if (!profileDetails) return;
    const group = searchParams.get("group");
    const filename = profileDetails.groupImage;
    const getProfileImage = async () => {
      try {
        const { data } = supabase.storage
          .from("profileImages")
          .getPublicUrl(`logos/${group}/${filename}`);

        if (data) {
          setProfileImage(data.publicUrl);
        }
      } catch (error) {
        console.error("Error fetching profile image", error);
      }
    };
    getProfileImage();
  }, [profileDetails, searchParams]);

  return (
    <main className="min-h-screen">
      <div style={{ margin: "0 auto" }}>
        <HeaderGradient>
          <div className="w-full relative flex items-center justify-between">
            <div className="relative w-[150px] h-[150px] z-20 ml-16">
              <Image
                src={profileImage as string}
                alt={`${searchParams.get("group")}-logo`}
                fill
                className="border-2 border-secondary rounded-full object-cover"
              />
            </div>
            <Divider orientation="horizontal" className="absolute z-10" />
            <div className="flex items-center gap-3 mr-16 mt-14">
              {[
                {
                  url: `https://facebook.com/${profileDetails?.facebookUrl}`,
                  icon: "/facebook.svg",
                },
                {
                  url: `https://instagram.com/${profileDetails?.instagramUrl}`,
                  icon: "/instagram.svg",
                },
                {
                  url: `https://twitter.com/${profileDetails?.twitterUrl}`,
                  icon: "/twitter.svg",
                },
              ].map((opt, idx) => (
                <Link href={opt.url} key={idx}>
                  <Image
                    src={opt.icon}
                    width={32}
                    height={32}
                    alt={`${opt.icon}`}
                  />
                </Link>
              ))}
            </div>
          </div>
          <section
            style={{ margin: "40px 64px" }}
            className="flex flex-col gap-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-bold text-4xl">{profileDetails?.group}</h1>
                <p className="text-secondary/80">{profileDetails?.bio}</p>
              </div>
              <div className="flex gap-5">
                <Button
                  variant="ghost"
                  color="secondary"
                  as="a"
                  href={`/create-profile?email=${encodeURIComponent(emailGroup)}&edit=true`}
                >
                  Editar Perfil
                </Button>
                <Button
                  variant="solid"
                  color="secondary"
                  as="a"
                  href="/blog?add=true"
                >
                  Crear Post
                </Button>
              </div>
            </div>
            <Divider orientation="horizontal" className="bg-secondary/30" />
            <Tabs
              aria-label="Options"
              color="secondary"
              variant="underlined"
              className="self-center mt-0"
              size="lg"
              selectedKey={tabSelected}
              onSelectionChange={setTabSelected as any}
            >
              {[
                { label: "Posts", icon: "/grid.svg" },
                { label: "Miembros", icon: "/members.svg" },
              ].map((opt) => (
                <Tab
                  key={opt.label}
                  title={
                    <div className="flex items-center space-x-2">
                      <Image
                        src={opt.icon}
                        alt={opt.label}
                        width={24}
                        height={24}
                      />
                      <span>{opt.label}</span>
                    </div>
                  }
                >
                  <section className="flex justify-center items-center">
                    {opt.label}
                  </section>
                </Tab>
              ))}
            </Tabs>
          </section>
        </HeaderGradient>
      </div>
    </main>
  );
}
