import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export const Subscribe = () => {

  const [email,setEmail] = useState("");

  const onSubmitHandler = async(e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("email",email);
    const response = await axios.post('/api/email',formData);
    if(response.data.success){
      toast.success(response.data.msg);
      setEmail("");
    }else{
      toast.error("Error")
    }
  }

  return (
    <div className='text-center my-8'>
        <h1 className='text-3xl sm:text-5xl font-medium'>Latest Blogs</h1>
        <p className='mt-10 max-w-185 m-auto text-xs sm:text-base'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo quia distinctio omnis nulla accusantium ex tenetur ipsam dolor eaque. Qui voluptas</p>
        <form onSubmit={onSubmitHandler} className='flex justify-between max-w-125 scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-7px_7px_0px_#000000]' action="">
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Enter your email' className='pl-4 outline-none' />
            <button  type="submit" className='border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white font-bold '>Subscribe</button>
        </form>
    </div>
  )
}
