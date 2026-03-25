"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react' // Required for useSearchParams

const ResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // Grab the token from the URL

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/auth/reset-password', { token, password });
            if (response.data.success) {
                toast.success("Password updated successfully!");
                router.push('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Token is invalid or expired.");
        } finally {
            setLoading(false);
        }
    }

    if (!token) return <div className="text-center mt-20 font-bold">Invalid or missing token.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Enter New Password</h2>
                <div className="mt-8 bg-white py-8 px-4 border border-black shadow-[-7px_7px_0px_#000000] sm:px-10">
                    <form className="space-y-6" onSubmit={onSubmitHandler}>
                        <div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-black placeholder-gray-400 focus:outline-none sm:text-sm"
                                placeholder="New Password"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors">
                            {loading ? 'Updating...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

// Wrap in Suspense because Next.js requires it when using useSearchParams in a client component
const ResetPassword = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}

export default ResetPassword;