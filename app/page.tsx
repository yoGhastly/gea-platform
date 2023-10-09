'use client';
import { useEffect, useState } from 'react';
import { PostCard, Slideshow } from './components';
import { poppins } from './fonts';
import { Post } from './interfaces';
import Image from 'next/image';
import { BASE_URL } from './constants';
import { supabase } from './lib/supabase';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [pastPosts, setPastPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { data: postsData, error } = await supabase
          .from("posts")
          .select("*")
          .lt('created_at', oneWeekAgo.toISOString()); // Filter for posts older than a week

        if (!postsData || error) {
          console.error("Could not retrieve posts", error);
          return;
        }

        const updatedPastPostsData = postsData?.map((post) => {
          const { data: imageData } = supabase.storage.from("postImages").getPublicUrl(
            `images/${post.group}_${post.date}/${post.image}`
          );
          return { ...post, image: imageData.publicUrl };
        });

        const { data: latestPostsData, error: latestPostsError } = await supabase
          .from("posts")
          .select("*")
          .order('created_at', { ascending: false }) // Order by created_at in descending order to get the latest posts first
          .limit(5); // Limit the result to the latest 5 posts

        if (latestPostsError) {
          console.error("Could not retrieve latest posts", latestPostsError);
          return;
        }

        // Process data for both past and latest posts as needed
        const updatedLatestPostsData = latestPostsData.map((post) => {
          const { data: imageData } = supabase.storage.from("postImages").getPublicUrl(
            `images/${post.group}_${post.date}/${post.image}`
          );
          return { ...post, image: imageData.publicUrl };
        });

        setPosts(updatedLatestPostsData as Post[]); // Set the filtered and sliced posts
        setPastPosts(updatedPastPostsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col gap-5 items-center justify-between md:py-3.5 px-3.5 md:px-24">
      <div className="w-full flex flex-col gap-10 justify-center items-center">
        <Slideshow posts={posts as Post[]} />
        <div className='mt-10 flex flex-col gap-10 items-center justify-center'>
          <h2 className={`${poppins.className} font-semibold font-sans text-center text-4xl md:text-5xl`}>Eventos pasados</h2>
          {
            pastPosts?.length ? (
              <section className='grid grid-cols-2 md:grid-cols-3 gap-10 md:mx-16'>
                {pastPosts.map((post, idx) => (
                  <PostCard key={idx} post={post} />
                ))}
              </section>
            ) : (
              <section className='flex flex-col justify-center items-center gap-5 w-full h-[500px]'>
                <Image src="/not-found.svg" alt="Not found" width={100} height={100} />
                <p>No hay eventos pasados por el momento.</p>
              </section>
            )
          }
        </div>
      </div>
    </main>
  );
}
