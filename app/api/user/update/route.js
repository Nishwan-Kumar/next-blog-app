import { connectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import imageKit from "@/lib/config/imagekit";

export async function POST(request) {
    try {
        console.log(">>> [UPDATE] Connection to DB...");
        await connectDB();
        
        console.log(">>> [UPDATE] Fetching Session...");
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log(">>> [UPDATE] No session found!");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const newName = formData.get('name');
        const newImage = formData.get('image'); 

        let updateData = { name: newName };

        // IMPROVED IMAGE CHECK: 
        // We only proceed if newImage is actually an object with data
        if (newImage && typeof newImage !== 'string' && newImage.size > 0) {
            console.log(">>> [UPDATE] Converting image to buffer...");
            const byteData = await newImage.arrayBuffer();
            const buffer = Buffer.from(byteData);

            console.log(">>> [UPDATE] Uploading to ImageKit...");
            // Sometimes ImageKit hangs on large files. 
            // Ensure your file isn't massive (e.g., > 5MB)
            const upload = await imageKit.upload({
                file: buffer,
                fileName: `profile-${session.user.id}-${Date.now()}`, // Added timestamp to prevent cache issues
                folder: "/Blog-App/profiles"
            });
            
            console.log(">>> [UPDATE] ImageKit Upload Success:", upload.url);
            updateData.image = upload.url;
        }

        console.log(">>> [UPDATE] Saving to MongoDB...");
        const updatedUser = await UserModel.findByIdAndUpdate(
            session.user.id, 
            updateData, 
            { new: true }
        );

        console.log(">>> [UPDATE] Done!");
        return NextResponse.json({ 
            success: true, 
            msg: "Profile Updated!", 
            user: { name: updatedUser.name, image: updatedUser.image } 
        });

    } catch (error) {
        console.error(">>> [UPDATE ERROR]:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}