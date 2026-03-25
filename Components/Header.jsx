import Image from 'next/image'
import React from 'react'
import { assets } from '@/Assets/assets'
import Link from 'next/link'

const Header = ({className=""}) => {

  return (
    <div className={`py-5 px-5 md:px-12 lg:px-28 ${className}`}>
        <div className='flex justify-between items-center'>
          <Link href="/">
            <Image src={assets.logo} width={180} alt='' className='w-32.5 sm:w-auto' priority/>
          </Link>
          <Link href ='/login'>
            <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]'>
                Get Started
                <Image src={assets.arrow} alt=''/>
            </button>
            </Link>
        </div>
    </div>
  )
}

export default Header