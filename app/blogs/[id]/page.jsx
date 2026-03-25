"use client"
import { assets, blog_data } from '@/Assets/assets'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import axios from 'axios'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, use } from 'react'

const Page = () => {

    const params = useParams()
    const [data,setData] = useState(null)

    const fetchBlogData = async ()=>{
        const response = await axios.get('/api/blog',{
            params:{
                id:params.id
            }
        })
        setData(response.data)
    }

    useEffect(() => {
        if (params.id) {
            fetchBlogData();
        }
    }, [params.id]);


    return (data?<>
        <div className='bg-gray-200 py-5 mx-auto'>
            <Header className='-mt-5'/>
            <div className='text-center my-25 mt-15'>
                <h1 className='text-center text-5xl font-semibold max-w-175 mx-auto'>{data.title}</h1>
                {/* LIVE AUTHOR IMAGE: Uses populated data first */}
                <Image 
                    className='mx-auto mt-6 border-4 border-white rounded-full aspect-square object-cover shadow-sm' 
                    src={data.authorId?.image || data.authorImg || assets.profile_icon} 
                    alt='Author' 
                    width={100} 
                    height={100} 
                />
                
                {/* LIVE AUTHOR NAME: Uses populated data first */}
                <p className='mt-3 pb-2 text-lg font-medium text-gray-800'>
                    By {data.authorId?.name || data.author}
                </p>
                
                <p className='text-sm text-gray-500 uppercase tracking-widest'>
                    {data.category}
                </p>
            </div>

        </div>
            
            <div className='mx-5 max-w-200 md:mx-auto -mt-25 mb-10'>
                <Image className='border-4 border-white' src={data.image} alt='' width={1280} height={720}/>
                <div className='blog-content' dangerouslySetInnerHTML={{__html:data.description}}>
                    
                </div>               
                <div className='my-24'>
                    <p className='text-black font-semibold my-4'>Share this article on social media</p>
                    <div className='flex'>
                        <Image src={assets.facebook_icon} alt='' width={50}/>
                        <Image src={assets.twitter_icon} alt='' width={50}/>
                        <Image src={assets.googleplus_icon} alt='' width={50}/>
                    </div>
                </div>
            </div>
            <Footer />
    </>:<></>
    )
}

export default Page