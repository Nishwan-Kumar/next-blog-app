import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import UserModel from "@/lib/models/UserModel"; // Adjust path if needed
import { connectDB } from "@/lib/config/db";    // Adjust path if needed

export async function GET() {
  try {
    await connectDB();

    // 1. Check if an admin already exists so we don't create duplicates
    const existingAdmin = await UserModel.findOne({ email: "admin@blog.com" });
    {
      if (existingAdmin)
        return NextResponse.json({ message: "Admin user already exists!" });
    }

    // 2. Hash the password securely
    const hashedPassword = await bcrypt.hash("AdminPassword123!", 10);

    // 3. Create the Admin user
    await UserModel.create({
      name: "Super Admin",
      image: "/author_img.png",
      email: "admin@blog.com", // Change this to your preferred admin email
      password: hashedPassword, // Change the password string above!
      role: "admin", // Explicitly setting the role to admin
    });

    return NextResponse.json({ message: "Admin user created successfully! You can now log in." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user", details: error.message }, { status: 500 });
  }
}