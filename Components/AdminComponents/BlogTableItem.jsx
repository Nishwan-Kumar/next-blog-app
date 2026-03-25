import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const BlogTableItem = ({mongoId,authorImg,title,author,date,deleteFunc}) => {

  return (
    <tr className='bg-white border-b'>
        <th scope='row' className='hidden sm:flex items-center gap-3 px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
            <Image src={authorImg?authorImg:assets.profile_icon} width={40} height={40} alt=''/>
            <p>{author?author:"No author"}</p>
        </th>
        <td className='px-6 py-4'>
            {title?title:"No Title"}
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            {date}
        </td>
        <td className='px-6 py-4 cursor-pointer flex gap-4'>
            {/* NEW EDIT BUTTON */}
            <Link 
                href={`/admin/editBlog/${mongoId}`} 
                className='text-blue-500 hover:text-blue-700 font-medium cursor-pointer'
            >
                Edit
            </Link>
            
            {/* EXISTING DELETE BUTTON */}
            <p 
                onClick={() => deleteFunc(mongoId)} 
                className='text-red-500 hover:text-red-700 font-medium cursor-pointer'
            >
                x
            </p>
        </td>
    </tr>
  )
}

export default BlogTableItem