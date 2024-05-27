import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <div className='h-screen w-full flex-center'>
      <Image 
        src="/icons/spin-loader.svg"
        alt="loading"
        width={90}
        height={90}
      />
    </div>
  )
}

export default Loader
