'use client';
import { useEffect, useState } from 'react';
import { PostCard, Slideshow } from './components'
import { poppins } from './fonts'
import { Post } from './interfaces';


export default function Home() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      const res = await fetch(`${window.origin}/api/posts`, {
        method: 'GET',
      })

      const { posts } = await res.json();
      setPosts(posts);
    }
    getPosts();
  }, []);

  return (
    <main className="flex min-h-screen flex-col gap-5 items-center justify-between py-3.5 px-24">
      <div className="w-full flex flex-col gap-10 justify-center items-center">
        <Slideshow posts={posts as Post[]} />
        <div className='mt-10 flex flex-col gap-10 items-center justify-center'>
          <h2 className={`${poppins.className} font-semibold font-sans text-5xl`}>Eventos</h2>
          <section className='grid grid-cols-3 gap-10 mx-16'>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
                <PostCard key={idx} />
              ))
            }
          </section>
        </div>
      </div>
    </main>
  )
}
