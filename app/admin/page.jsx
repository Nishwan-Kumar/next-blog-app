'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus, ListOrdered, Mail, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

const Page = () => {
  // Animation variants for the container
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
  const [blogsCount,setBlogsCount] = useState(0)

  const [subscribersCount,setSubscribersCount] = useState(0)

  const totalBlogs = async ()=>{
    try {
        const response = await axios.get('/api/blog'); 
        if (response.data.blogs) {
            setBlogsCount(response.data.blogs.length);
        }
    } catch (error) {
        console.error("Error fetching blogs count:", error);
    }
  }

  const totalSubs = async()=>{
    try {
        const response = await axios.get('/api/email');
        const emails = response.data.emails || response.data.email; 
        if (emails) {
            setSubscribersCount(emails.length);
        }
    } catch (error) {
        console.error("Error fetching subscribers count:", error);
    }
  }

  useEffect(()=>{
    totalSubs()
    totalBlogs()
  },[])

  // Animation variants for individual items
  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-8 flex-1"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVars} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Here is what is happening with your blog today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Blogs Stat */}
        <motion.div 
          variants={itemVars}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"
        >
          <div className="p-4 bg-blue-50 rounded-lg text-blue-600">
            <ListOrdered size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Blogs</p>
            <h2 className="text-2xl font-bold text-gray-800">{blogsCount}</h2>
          </div>
        </motion.div>

        {/* Subscriptions Stat */}
        <motion.div 
          variants={itemVars}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"
        >
          <div className="p-4 bg-green-50 rounded-lg text-green-600">
            <Mail size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Subscribers</p>
            <h2 className="text-2xl font-bold text-gray-800">{subscribersCount}</h2>
          </div>
        </motion.div>

        {/* Engagement Stat */}
        <motion.div 
          variants={itemVars}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"
        >
          <div className="p-4 bg-purple-50 rounded-lg text-purple-600">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Views</p>
            <h2 className="text-2xl font-bold text-gray-800">4.2k</h2>
          </div>
        </motion.div>

      </div>

      {/* Quick Actions Section */}
      <motion.div variants={itemVars} className="mt-12">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <Link href='/admin/addProduct'>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-gray-800 transition-colors"
          >
            <ImagePlus size={20} /> Add New Post
          </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Page;