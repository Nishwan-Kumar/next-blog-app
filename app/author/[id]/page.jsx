"use client"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import BlogItem from '@/Components/BlogItem'
import Header from '@/Components/Header'
import Footer from '@/Components/Footer'
import { assets } from '@/Assets/assets'

const AuthorProfile = () => {
    const params = useParams();
    const [author, setAuthor] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAuthorAndBlogs = async () => {
        try {
            // We'll create a new API endpoint or use the public blog one with a filter
            const response = await axios.get(`/api/blog?public=true&authorId=${params.id}`);
            setBlogs(response.data.blogs);
            
            // Since our blogs are "populated", we can grab the author info from the first blog
            if (response.data.blogs.length > 0) {
                setAuthor(response.data.blogs[0].authorId);
            }
        } catch (error) {
            console.error("Error fetching author data", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (params.id) fetchAuthorAndBlogs();
    }, [params.id]);

    if (loading) return <div className='h-screen flex items-center justify-center font-bold'>Loading Author Profile...</div>

    return (
        <>
            <Header />
            <div className='py-10 px-5 md:px-24 bg-gray-50'>
                {/* Author Info Section */}
                <div className='flex flex-col items-center text-center mb-16'>
                    <Image 
                        src={author?.image || assets.profile_icon} 
                        width={120} 
                        height={120} 
                        className='rounded-full border-4 border-white shadow-md aspect-square object-cover'
                        alt='Author'
                    />
                    <h1 className='text-3xl font-bold mt-4'>{author?.name || "Author"}</h1>
                    <p className='text-gray-500 max-w-md mt-2'>
                        Contributor at Blog-App. Sharing insights and stories with the community.
                    </p>
                    <div className='bg-black text-white px-4 py-1 rounded-full text-xs mt-4'>
                        {blogs.length} {blogs.length === 1 ? 'Post' : 'Posts'} Published
                    </div>
                </div>

                {/* Author's Blogs Grid */}
                <div className='flex flex-wrap justify-center gap-y-10 gap-x-6 mb-16'>
                    {blogs.length > 0 ? (
                        blogs.map((item, index) => (
                            <BlogItem 
                                key={index} 
                                id={item._id} 
                                image={item.image} 
                                title={item.title} 
                                category={item.category} 
                                description={item.description} 
                                authorId={item.authorId}
                            />
                        ))
                    ) : (
                        <div className='flex flex-col items-center justify-center py-20 w-full'>
                            <Image src={assets.no_blogs_icon} width={100} height={100} alt="No blogs" className='opacity-20' />
                            <p className='text-gray-400 mt-4 font-medium'>This author hasn't shared any stories yet.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AuthorProfile