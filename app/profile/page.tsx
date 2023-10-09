"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import { HeaderGradient } from "../components";
import Image from "next/image";
import { Button, Divider, Tab, Tabs } from "@nextui-org/react";
import Link from "next/link";
import { useMediaQuery } from "../lib/useMediaQuery";
import { Post } from "../interfaces";
import { BASE_URL } from "../constants";

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
  const group = searchParams.get("group");
  const [profileDetails, setProfileDetails] = useState<Profile | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [tabSelected, setTabSelected] = useState("Posts");
  const [emailGroup, setEmailGroup] = useState("");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [showButtons, setShowButtons] = useState(false);
  const isSm = useMediaQuery(480);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) {
        setShowButtons(true);
      }
    });
  }, []);

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
  }, [profileDetails, searchParams, group]);

  useEffect(() => {
    const getPostsByGroup = async (group: string) => {
      try {
        const { data: posts, error } = await supabase.from("posts").select("*").eq('group', group);
        const groupPosts = posts?.filter((post: Post) => post.group === group);
        if (error) {
          console.error(error);
          return;
        }
        setPosts(groupPosts as Post[] && []);
      } catch (e) {
        console.error(e);
      }
    };
    getPostsByGroup(group as string);
  }, [group]);

  useEffect(() => {
    if (!posts) {
      push("/");
    }
  }, [posts])

  return (
    <main className="min-h-screen">
      <div style={{ margin: "0 auto" }}>
        <HeaderGradient>
          <div className="w-full relative flex items-center gap-5 justify-between">
            <div className="relative w-[100px] h-[100px] md:w-[150px] md:h-[150px] z-20 md:ml-16">
              <Image
                src={profileImage as string}
                alt={`${searchParams.get("group")}-logo`}
                fill
                className="border-2 border-secondary rounded-full object-cover"
              />
            </div>
            <Divider orientation="horizontal" className="absolute z-10" />
            <div className="flex items-center gap-3 md:mr-16 mt-10 md:mt-14">
              {[
                {
                  url: `${BASE_URL}/calendar`,
                  icon: "/calendar.svg",
                },
                {
                  url: `https://facebook.com/${profileDetails?.facebookUrl}`,
                  icon: "/facebook.svg",
                },
                {
                  url: `https://instagram.com/${profileDetails?.instagramUrl}`,
                  icon: "/Instagram.svg",
                },
                {
                  url: `https://twitter.com/${profileDetails?.twitterUrl}`,
                  icon: "/twitter.svg",
                },
              ].map((opt, idx) => (
                <Link href={opt.url} key={idx}>
                  <Image
                    src={opt.icon}
                    width={isSm ? 28 : 32}
                    height={isSm ? 28 : 32}
                    alt={`${opt.icon}`}
                  />
                </Link>
              ))}
            </div>
          </div>
          <section
            style={{ margin: `${isSm ? "40px 0px" : "40px 64px"}` }}
            className="flex flex-col gap-10"
          >
            <div className="flex gap-8 md:gap-0 flex-col md:flex-row item-start md:items-center justify-between">
              <div>
                <h1 className="font-extrabold text-2xl md:text-4xl">
                  {profileDetails?.group}
                </h1>
                <p className="text-secondary/80 text-md md:text-2xl">
                  {profileDetails?.bio}
                </p>
              </div>
              <div className={`${showButtons ? "flex gap-5" : "hidden"}`}>
                <Button
                  variant="ghost"
                  color="secondary"
                  as="a"
                  href={`/create-profile?email=${encodeURIComponent(
                    emailGroup
                  )}&edit=true`}
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
                { label: "Posts", icon: "/grid.svg", content: posts },
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
                  <section className="grid grid-cols-3 md:grid-cols-4 w-full">
                    <div className="relative w-[150px] h-[150px] md:w-[300px] md:h-[300px]">
                      {tabSelected === 'Posts' && opt.label === 'Posts' && (
                        <section className="grid grid-cols-3 md:grid-cols-4 w-full">
                          <div className="relative w-[150px] h-[150px] md:w-[300px] md:h-[300px]">
                            {opt.content?.map((post, idx) => (
                              <Image
                                key={idx}
                                src={post.image}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                              />
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
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
