"use client"
import { useSession } from "next-auth/react";
import Image from "next/image";
import { assets } from "@/Assets/assets";

export default function AdminHeaderImage() {
    const { data: session } = useSession();

    // This will react INSTANTLY when update() is called in your profile page
    return (
        <Image 
            src={session?.user?.image || assets.profile_icon} 
            width={40} 
            height={40} 
            className="rounded-full cursor-pointer border border-gray-300 object-cover aspect-square" 
            alt="Profile"
        />
    );
}