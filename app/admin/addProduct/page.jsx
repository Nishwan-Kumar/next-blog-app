'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const page = () => {
    const [loading, setLoading] = useState(false);
    const [image,setImage] = useState(null);
    const [data,setData] = useState({
        title:"",
        description:"",
        category:"Startup",
        author:"Alex Bennett",
        authorImg:"/author_img.png",
    }) 

    const FormSkeleton = () => (
      <div className='pt-5 px-5 sm:pt-12 sm:pl-16 animate-pulse'>
        {/* Label Skeleton */}
        <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
        
        {/* Image Upload Area Skeleton */}
        <div className="w-35 h-17.5 bg-gray-200 rounded mt-4"></div>
    
        {/* Title Input Skeleton */}
        <div className="h-6 w-32 bg-gray-200 rounded mt-8"></div>
        <div className="w-full sm:w-125 h-12 bg-gray-100 rounded mt-4"></div>
    
        {/* Description Area Skeleton */}
        <div className="h-6 w-40 bg-gray-200 rounded mt-8"></div>
        <div className="w-full sm:w-125 h-37.5 bg-gray-100 rounded mt-4"></div>
    
        {/* Category Skeleton */}
        <div className="h-6 w-36 bg-gray-200 rounded mt-8"></div>
        <div className="w-40 h-12 bg-gray-100 rounded mt-4"></div>
    
        {/* Button Skeleton */}
        <div className="mt-8 w-40 h-12 bg-gray-300 rounded"></div>
      </div>
    );

    const onChangeHandler = (event)=>{
        const name=event.target.name;
        const value = event.target.value
        setData(data=>({...data,[name]:value}))
    }
    
    const onSubmitHandler = async(e)=>{
        e.preventDefault()
        setLoading(true);
        if (!image) {
            return toast.error("Please upload a thumbnail image");
        }
        const formData = new FormData();
        
        formData.append('title',data.title)
        formData.append('description',data.description)
        formData.append('category',data.category)
        formData.append('author',data.author)
        formData.append('image',image)
        formData.append('authorImg',data.authorImg)

        try {
        const response = await axios.post('/api/blog', formData); 
        if (response.status === 200 || response.data.success) {
            toast.success(response.data.msg || "Blog added successfully!");
            
            setImage(null);
            setData({
                title: "",
                description: "",
                category: "Startup",
                author: "Nishwan Kumar",
                authorImg: "/author_img.png",
            });
            }else {
                    toast.error("Failed to add blog");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.msg || "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
    return <FormSkeleton />;
    }
  return (
    <>
        <form className='pt-5 px-5 sm:pt-12 sm:pl-16' onSubmit={onSubmitHandler}>
            <p className='text-xl'>Upload thumbnail</p>
            <div className='w-full'>
                <div className='relative w-35 mt-4'>
                    <label htmlFor="image" className="">
                        <Image className='mt-4' src={!image?assets.upload_area:URL.createObjectURL(image)} width={140} height={70} alt='Upload Preview'/>
                        
                    </label>
                    {image && (<button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition-colors ">X</button>)}
                </div>
            <input name='image' type="file" id='image' hidden required onChange={(e)=>setImage(e.target.files[0])}/>

            <p className='text-xl mt-4'>Blog Title</p>
            <input name='title' onChange={onChangeHandler} value={data.title} className='w-full sm:w-125 mt-4 px-4 py-3 border' type="text" placeholder='Type here' />

            <p className='text-xl mt-4'>Blog Description</p>
            <textarea  name='description' onChange={onChangeHandler} value={data.description}  className='w-full sm:w-125 mt-4 px-4 py-3 border' type="text" placeholder='write content here' rows={6}/>
            </div>

            <p className='text-xl mt-4'>Blog Category</p>
            <select  name='category' onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py-3 border text-gray-500'>
                <option value="Startup">Startup</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
            </select>
            <br /> 
            <button type='submit' className='mt-8 w-40 h-12 bg-black text-white'>ADD</button>
        </form>
    </>
  )
}

export default page