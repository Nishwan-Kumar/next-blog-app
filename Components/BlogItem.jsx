import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogItem = ({ image, title, category, description, id, authorId, author, authorImg }) => {
  
  // Use the populated ID first (Live data), fallback to static props (Backup data)
  const liveAuthorName = authorId?.name || author;
  const liveAuthorImg = authorId?.image || authorImg || assets.profile_icon;

  return (
    <div className='max-w-82.5 sm:max-w-75 bg-white border border-black transition-all duration-300 ease-in-out hover:shadow-[-7px_7px_0px_#000000] flex flex-col justify-between'>
      <div>
        <Link href={`/blogs/${id}`}>
          <Image src={image} alt='' width={400} height={400} className='border-b border-black aspect-video object-cover' />
        </Link>
        
        <p className='ml-5 mt-5 px-2 inline-block bg-black text-white text-xs font-medium uppercase' >
          {category}
        </p>

        <div className='p-5 pb-2'>
          <h5 className='mb-2 text-lg font-bold tracking-tight text-gray-900 leading-tight'>{title}</h5>
          <div className='mb-3 text-sm tracking-tight text-gray-700 line-clamp-3'
            dangerouslySetInnerHTML={{ __html: description.slice(0, 120) }}>
          </div>
        </div>
      </div>

      <div className='p-5 pt-0 mt-auto'>
        <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
            {/* THIS IS THE LIVE LINKED AUTHOR DATA */}
            <div className='flex items-center gap-2'>
              <Link href={`/author/${authorId?._id || ''}`} className='flex items-center gap-2 hover:opacity-80 transition'>
                <Image 
                    src={liveAuthorImg} 
                    alt={liveAuthorName} 
                    width={30} 
                    height={30} 
                    className='rounded-full aspect-square object-cover border border-black'
                />
                <p className='text-xs font-semibold text-gray-800'>{liveAuthorName}</p>
              </Link>
            </div>

            <Link href={`/blogs/${id}`} className='inline-flex items-center font-bold text-xs gap-2 cursor-pointer hover:underline'>
              Read More <Image src={assets.arrow} alt='' width={10} />
            </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogItem