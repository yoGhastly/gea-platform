'use client';
import { PostCard, Slideshow } from './components'
import { poppins } from './fonts'

export default function Home() {
  const posts = [
    {
      date: "Sep 23, 2023",
      src: '/carousel-image.png',
      title: 'Asesorias Medio Curso',
      postId: 1,
    },
    {
      date: "Sep 24, 2023",
      src: '/carousel-image.png',
      title: 'Examenes Medio Curso',
      postId: 2
    },
  ];
  return (
    <main className="flex min-h-screen flex-col gap-5 items-center justify-between py-3.5 px-24">
      <div className="w-full flex flex-col gap-10 justify-center items-center">
        <Slideshow posts={posts} />
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
