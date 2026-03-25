"use client"
import { assets } from '@/Assets/assets';
import axios from 'axios';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const EditBlog = () => {
    const params = useParams();
    const router = useRouter();
    
    // States for handling images
    const [image, setImage] = useState(null); // Holds a NEW image if the user selects one
    const [previewImage, setPreviewImage] = useState(""); // Holds the OLD thumbnail from the database
    
    // State to block rendering until data arrives
    const [loading, setLoading] = useState(true); 
    
    // Form data state
    const [data, setData] = useState({
        title: "",
        description: "",
        category: "Startup",
    });

    // 1. Fetch Existing Data on Page Load
    const fetchBlogData = async () => {
        try {
            const response = await axios.get('/api/blog', { params: { id: params.id } });
            if (response.data) {
                // Populate the form fields with the old data
                setData({
                    title: response.data.title,
                    description: response.data.description,
                    category: response.data.category,
                });
                // Set the old thumbnail
                setPreviewImage(response.data.image || ""); 
            }
        } catch (error) {
            toast.error("Failed to load existing blog data");
        } finally {
            // Unblock the render ONLY after data is set
            setLoading(false); 
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchBlogData();
        }
    }, [params.id]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    // 2. Submit the Updates
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', params.id);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        
        // Only attach a new image if the user actually selected one
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.put('/api/blog', formData);
            if (response.data.success) {
                toast.success(response.data.msg);
                router.push('/admin/blogList');
            } else {
                toast.error("Error updating blog");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Server Error");
        }
    };

    // IF DATA IS STILL FETCHING, SHOW THIS INSTEAD OF CRASHING
    if (loading) {
        return <div className='pt-12 pl-16 font-bold text-xl text-gray-600'>Loading your blog data...</div>;
    }

    // Determine which image to show: The newly uploaded one OR the old database one
    const displayImageSrc = image ? URL.createObjectURL(image) : previewImage;

    return (
        <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16'>
            
            {/* 1. Thumbnail Preview */}
            <p className='text-xl'>Update thumbnail</p>
            <label htmlFor="image">
                <Image 
                    className='mt-4 aspect-video object-cover cursor-pointer border border-gray-300 shadow-sm' 
                    src={displayImageSrc || assets.upload_area} 
                    width={200} 
                    height={110} 
                    alt='Thumbnail Preview' 
                />
            </label>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />

            {/* 2. Pre-filled Title */}
            <p className='text-xl mt-6'>Blog title</p>
            <input 
                name='title' 
                onChange={onChangeHandler} 
                value={data.title} 
                className='w-full sm:w-[500px] mt-4 px-4 py-3 border border-gray-400' 
                type="text" 
                placeholder='Type here' 
                required 
            />

            {/* 3. Pre-filled Description */}
            <p className='text-xl mt-6'>Blog Description</p>
            <textarea 
                name='description' 
                onChange={onChangeHandler} 
                value={data.description} 
                className='w-full sm:w-[500px] mt-4 px-4 py-3 border border-gray-400' 
                rows={6} 
                placeholder='write content here' 
                required 
            />

            {/* 4. Pre-filled Category */}
            <p className='text-xl mt-6'>Blog category</p>
            <select 
                name="category" 
                onChange={onChangeHandler} 
                value={data.category} 
                className='w-40 mt-4 px-4 py-3 border border-gray-400 text-gray-500'
            >
                <option value="Startup">Startup</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
            </select>
            
            <br />
            
            <button type='submit' className='mt-8 w-40 h-12 bg-black text-white cursor-pointer hover:bg-gray-800 transition-colors shadow-[-5px_5px_0px_#000000]'>
                Save Changes
            </button>
        </form>
    );
};

export default EditBlog;