import { assets } from "@/Assets/assets"
import Sidebar from "@/Components/AdminComponents/Sidebar"
import Image from "next/image"
import { ToastContainer } from 'react-toastify';
import Link from "next/link";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
import AdminHeaderImage from "@/Components/AdminComponents/AdminHeaderImage";


export default async function Layout({children}){
    const session = await getServerSession(authOptions)
    return (
        <>
            <div className="flex">
                <ToastContainer theme="dark"/>
                <Sidebar />
                <div className="flex flex-col w-full ml-28 sm:ml-80">
                    <div className="sticky top-0 z-40 bg-white flex items-center justify-between w-full py-2.5 max-h-60px px-12 border border-b border-black">
                        <h3 className="font-medium">Admin Panel</h3>
                       <Link href="/admin/profile">
                            {/* Use the client component here */}
                            <AdminHeaderImage />
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}