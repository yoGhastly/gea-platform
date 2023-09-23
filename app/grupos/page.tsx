import React from "react";

export default function GroupsPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <section className='grid grid-cols-3 gap-10 mx-16'>
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((_, idx) => (
            <div className='w-[300px] h-[200px] rounded-2xl bg-gray-500' key={idx}></div>
          ))
        }
      </section>
    </div>
  )
}
