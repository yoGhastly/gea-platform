'use client';
import { useEffect, useState } from 'react';
import { PostCard, Slideshow } from './components';
import { poppins } from './fonts';
import { Post } from './interfaces';
import Image from 'next/image';

export default function Home() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [pastPosts, setPastPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, pastPostsRes] = await Promise.all([
          fetch(`${window.origin}/api/posts`, { method: 'GET', next: { revalidate: 300 } }),
          fetch(`${window.origin}/api/posts/past`, { method: 'GET', next: { revalidate: 300 } }),
        ]);

        const { posts } = await postsRes.json();
        const { pastPosts } = await pastPostsRes.json();

        setPosts(posts);
        setPastPosts(pastPosts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col gap-5 items-center justify-between py-3.5 px-24">
      <div className="w-full flex flex-col gap-10 justify-center items-center">
        <Slideshow posts={posts as Post[]} />
        <div className='mt-10 flex flex-col gap-10 items-center justify-center'>
          <h2 className={`${poppins.className} font-semibold font-sans text-center text-4xl md:text-5xl`}>Eventos pasados</h2>
          {
            pastPosts ? (
              <section className='grid grid-cols-3 gap-10 mx-16'>
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
