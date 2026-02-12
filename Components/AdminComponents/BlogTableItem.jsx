import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'

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
        <td className='px-6 py-4 cursor-pointer' onClick={()=>deleteFunc(mongoId)}>
            X
        </td>
    </tr>
  )
}

export default BlogTableItem