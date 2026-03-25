"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ImageCropper from '@/Components/AdminComponents/imageCropper'; // Ensure this path is correct

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null); // The cropped Blob
    const [previewUrl, setPreviewUrl] = useState(null); // The UI preview
    const [rawImage, setRawImage] = useState(null); // For the Cropper modal
    const [showCropper, setShowCropper] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sync name when session loads
    useEffect(() => {
        if (session?.user?.name) setName(session.user.name);
    }, [session]);

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setRawImage(reader.result);
                setShowCropper(true);
            };
        }
    };

    const handleCropComplete = (croppedBlob) => {
        const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(croppedBlob));
        setShowCropper(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('name', name);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axios.post('/api/user/update', formData);
            
            if (response.data.success) {
                const newUserData = {
                    name: name,
                    image: response.data.user.image // The URL from ImageKit
                };

                // 1. INSTANT UI UPDATE: Use the session's update function 
                // This pushes the new data to the Header/Sidebar immediately
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        ...newUserData
                    }
                });

                // 2. Clear the "unsaved" local preview so it uses the real session image
                setPreviewUrl(null); 
                setImageFile(null);
                
                toast.success("Profile Updated Instantly!");
            }
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 max-w-2xl">
            {showCropper && (
                <ImageCropper 
                    image={rawImage} 
                    onCropComplete={handleCropComplete} 
                    onCancel={() => setShowCropper(false)} 
                />
            )}

            <h1 className="text-2xl font-semibold mb-8">Admin Profile Settings</h1>
            
            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                {/* Profile Image Preview Section */}
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                        <img 
                            src={previewUrl || session?.user?.image || "/author_img.png"} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-black shadow-md"
                        />
                    </div>
                    <div>
                        <p className="font-medium">Profile Picture</p>
                        <label className="text-sm text-blue-600 cursor-pointer hover:underline">
                            Change Photo
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={onFileChange} 
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Name Input */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Full Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="border-2 p-3 border-black rounded-md focus:ring-2 focus:ring-gray-200 outline-none"
                        placeholder="Your Name"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`bg-black text-white py-3 px-6 rounded-md font-bold transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                >
                    {loading ? "Saving Changes..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}