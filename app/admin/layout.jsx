import { assets } from "@/Assets/assets"
import Sidebar from "@/Components/AdminComponents/Sidebar"
import Image from "next/image"
import { ToastContainer } from 'react-toastify';
export default function Layout({children}){
    return (
        <>
            <div className="flex">
                <ToastContainer theme="dark"/>
                <Sidebar />
                <div className="flex flex-col w-full ml-28 sm:ml-80">
                    <div className="sticky top-0 z-40 bg-white flex items-center justify-between w-full py-2.5 max-h-60px px-12 border border-b border-black">
                        <h3 className="font-medium">Admin Panel</h3>
                        <Image src={assets.profile_icon} width={40} alt=""/>
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}