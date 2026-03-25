import { connectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request) {
    try {
        await connectDB();
        const { email } = await request.json();

        // 1. Find the user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "No user found with that email" }, { status: 404 });
        }

        // 2. Generate a secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash the token and save it to the database (Security best practice)
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes
        await user.save();

        // 3. Create the reset URL
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

        // 4. Send the email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from:`"Blogger Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request - Blog App",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password for Blogger.</p>
                <p>Please click the button below to set a new password. This link is valid for 15 minutes:</p>
                <a href="${resetUrl}" 
                style="background-color: #000000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
                </a>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>If you did not request this, please ignore this email.</p>
            </div>`
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, msg: "Email sent successfully!" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: "Could not send email" }, { status: 500 });
    }
}