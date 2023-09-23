import { Carousel } from './components'
import { poppins } from './fonts'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-5 items-center justify-between py-0 px-24">
      <div className="w-full flex flex-col gap-10 justify-center items-center">
        <h1 className={`self-start text-3xl italic font-bold`}>Próximos eventos</h1>
        <Carousel images={["/carousel-image.png", "/carousel-image.png", "/carousel-image.png"]} />
        <h2 className={`${poppins.className} font-bold italic text-4xl mt-10`}>Eventos</h2>
        <section className='grid grid-cols-3 gap-10 mx-16'>
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
              <div className='w-[300px] h-[200px] rounded-2xl bg-gray-500' key={idx}></div>
            ))
          }
        </section>
      </div>

      <footer className="flex flex-wrap sm:flex-nowrap h-24 w-full items-center justify-center border-t">
        <p className='text-primary'>© 2023 Derechos Reservados. Elaborado por <span className='font-bold'>Xervsware</span></p>
      </footer>
    </main>
  )
}
