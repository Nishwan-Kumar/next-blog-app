"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'
import Image from 'next/image'
import { assets } from '@/Assets/assets'

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // This will call the API we build for sending the email
            const response = await axios.post('/api/auth/forgot-password', { email });
            
            if (response.data.success) {
                toast.success(response.data.msg || "Password reset link sent to your email!");
                setEmail('');
            } else {
                toast.error(response.data.error || "Something went wrong.");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Error sending reset link.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
                <Link href="/">
                    {/* Make sure assets.logo exists, or replace this with a text heading temporarily */}
                    <Image src={assets.logo} alt="Logo" width={150} priority />
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or return to{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 border border-black shadow-[-7px_7px_0px_#000000] sm:px-10">
                    <form className="space-y-6" onSubmit={onSubmitHandler}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
                                    placeholder="Enter your registered email"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black active:scale-95 transition-transform disabled:bg-gray-400 disabled:active:scale-100"
                            >
                                {loading ? 'Sending link...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}