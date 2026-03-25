import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import UserModel from "@/lib/models/UserModel"; // Adjust path if needed
import { connectDB } from "@/lib/config/db";

export async function POST(request) {
    try {
        await connectDB();
        const { name, email, password } = await request.json();

        // 1. Validate input
        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // 2. Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
        }

        // 3. Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create the new user (Role will default to "user" based on our schema)
        await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}