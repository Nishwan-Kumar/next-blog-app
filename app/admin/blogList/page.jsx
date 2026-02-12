'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios';
import React, { useState,useEffect } from 'react'
import { toast } from 'react-toastify';

const page = () => {

  const [blogs,setBlogs] = useState([]);

  const fetchBlogs = async()=>{
    try{
      const response = await axios.get('/api/blog');
      console.log(response.data.blogs)
      setBlogs(response.data.blogs)
    }catch(err){
      console.error(err)
    }
  }

  const deleteBlog = async(mongoId)=>{
    const response = await axios.delete('/api/blog',{
      params:{
        id:mongoId
      }
    })
    toast.success(response.data.msg)
    fetchBlogs()
  }
  useEffect(()=>{
    fetchBlogs();
  },[]) 
return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1 className='text-xl font-semibold'>All blogs</h1>
      <div className='relative h-[80vh] max-w-212.5 overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
        {/* Changed max-w-full to w-full and fixed tex-sm typo */}
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-sm text-left uppercase bg-gray-100'>
            <tr>
              <th scope='col' className='hidden sm:table-cell px-6 py-3'>Author Name</th>
              <th scope='col' className='px-6 py-3'>Blog Title</th>
              <th scope='col' className='px-6 py-3'>Date</th>
              <th scope='col' className='px-6 py-3'>Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((item, index) => {
              const formattedDate = new Date(item.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              return (
                <BlogTableItem 
                  key={index} 
                  mongoId={item._id} 
                  authorImg={item.authorImg} 
                  title={item.title} 
                  author={item.author} 
                  date={formattedDate}
                  deleteFunc = {deleteBlog}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default page