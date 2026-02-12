'use client'
import { blog_data } from '@/Assets/assets'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

const SeedPage = () => {
    const [seeding, setSeeding] = useState(false);

    const startSeeding = async () => {
        setSeeding(true);
        toast.info("Starting seed... check console for progress");

        for (const blog of blog_data) {
            try {
                // 1. Convert the imported local image to a File object
                const response = await fetch(blog.image.src); 
                const blob = await response.blob();
                const file = new File([blob], `blog-${blog.id}.png`, { type: 'image/png' });

                // 2. Prepare FormData exactly like your manual form
                const formData = new FormData();
                formData.append('title', blog.title);
                formData.append('description', blog.description);
                formData.append('category', blog.category);
                formData.append('author', blog.author);
                formData.append('authorImg', '/author_img.png'); // Default author img path
                formData.append('image', file); // The actual image file

                // 3. Send to your API
                const apiRes = await axios.post('/api/blog', formData);
                
                if (apiRes.data.success) {
                    console.log(`✅ Seeded: ${blog.title}`);
                }
            } catch (error) {
                console.error(`❌ Error seeding ${blog.id}:`, error);
            }
        }

        setSeeding(false);
        toast.success("Seeding finished!");
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Database Seeder</h1>
            <p className="mb-6">Clicking this will upload all 16 local blog images to ImageKit and save entries to MongoDB.</p>
            <button 
                onClick={startSeeding} 
                disabled={seeding}
                className="px-6 py-3 bg-black text-white rounded disabled:bg-gray-400"
            >
                {seeding ? "Uploading 16 Blogs..." : "Start Seeding Data"}
            </button>
        </div>
    );
};

export default SeedPage;