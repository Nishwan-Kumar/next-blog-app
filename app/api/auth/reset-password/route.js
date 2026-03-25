import { connectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs"; // Assuming you use bcryptjs for passwords

export async function POST(request) {
    try {
        await connectDB();
        const { token, password } = await request.json();

        // 1. Re-hash the token from the URL to match what is saved in the DB
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");


        console.log("Token from URL:", token);
        console.log("Hashed Token searching for:", hashedToken);
        // 2. Find the user with this token AND ensure it hasn't expired
        const user = await UserModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() } // $gt means "Greater Than" right now
        });

        if (!user) {
            return NextResponse.json({ error: "Token is invalid or has expired" }, { status: 400 });
        }

        // 3. Hash the new password and save it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // 4. Clear the reset token fields so they can't be used again
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save();

        return NextResponse.json({ success: true, msg: "Password Reset Successfully" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}