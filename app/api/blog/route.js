import { connectDB } from "@/lib/config/db"
import { NextResponse } from "next/server"
import imageKit from "@/lib/config/imagekit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserModel from "@/lib/models/UserModel";
import BlogModel from "@/lib/models/BlogModel";

export const runtime = "nodejs";

// app/api/blog/route.js

export async function GET(request) {
    try {
        await connectDB();
        
        // This line is NOT useless. It ensures Mongoose knows the 'User' model exists 
        // before we try to populate it.
        const User = UserModel; 

        const blogId = request.nextUrl.searchParams.get("id");
        const isPublicRequest = request.nextUrl.searchParams.get("public") === "true";
        const filterAuthorId = request.nextUrl.searchParams.get("authorId");


        // Use the explicit population syntax to avoid the 500 error
        const populateQuery = {
            path: 'authorId',
            select: 'name image',
            model: User // Explicitly passing the model here
        };

        if (blogId) {
            const blog = await BlogModel.findById(blogId).populate(populateQuery);
            return NextResponse.json(blog);
        } 

        if (isPublicRequest) {
            let query = {};
            if (filterAuthorId) {
                query = { authorId: filterAuthorId };
            }
            const blogs = await BlogModel.find(query)
                .populate(populateQuery)
                .sort({ date: -1 });
            return NextResponse.json({ blogs });
        }

        // ... rest of your session check and admin logic
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const blogs = await BlogModel.find(
            session.user.role === 'admin' ? {} : { authorId: session.user.id }
        ).populate(populateQuery);

        return NextResponse.json({ blogs });

    } catch (error) {
        console.error("GET BLOG ERROR:", error); // Log this to your terminal!
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const formData = await request.formData();
        const title = formData.get('title')
        const blogImage = formData.get('image')

        if (!title || !blogImage) {
            return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
        }

        const uploadToImageKit = async (file, folder, namePrefix) => {
            const byteData = await file.arrayBuffer();
            const buffer = Buffer.from(byteData);
            return await imageKit.upload({
                file: buffer,
                fileName: `${namePrefix}-${file.name}`,
                folder
            });
        };

        const blogUpload = await uploadToImageKit(blogImage, "/Blog-App/blog-images", Date.now());

        // 5. SAVE WITH ID REFERENCE
        const newBlog = new BlogModel({
            title: title,
            description : `${formData.get('description')}`,
            category : `${formData.get('category')}`,
            authorId: session.user.id, // THE LINK
            author: session.user.name, // Static backup
            authorImg: session.user.image, // Static backup
            image : blogUpload.url,
            fileId: blogUpload.fileId,
        });

        await newBlog.save();
        return NextResponse.json({ msg: "Blog Created Successfully" });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Add this below your POST and GET functions in app/api/blog/route.js

export async function PUT(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const description = formData.get('description');
        const category = formData.get('category');
        const newImage = formData.get('image'); // Might be a file, or might be empty if unchanged

        if (!id || !title || !description || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Find the existing blog
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        // 2. Security: Verify Ownership or Admin status
        const blogAuthorId = blog.authorId._id ? blog.authorId._id.toString() : blog.authorId.toString();
        const isOwner = blogAuthorId === session.user.id;
        const isAdmin = session.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: "Forbidden: You don't own this post" }, { status: 403 });
        }

        // 3. Prepare Update Data
        let updateData = { title, description, category };

        // 4. Handle Image Update (If the user selected a new image)
        if (newImage && typeof newImage === 'object' && newImage.name) {
            // Delete old image from ImageKit first
            if (blog.fileId) {
                await imageKit.deleteFile(blog.fileId).catch(e => console.log("Old image cleanup failed:", e.message));
            }

            // Upload new image
            const byteData = await newImage.arrayBuffer();
            const buffer = Buffer.from(byteData);
            const blogUpload = await imageKit.upload({
                file: buffer,
                fileName: `${Date.now()}-${newImage.name}`,
                folder: "/Blog-App/blog-images"
            });

            updateData.image = blogUpload.url;
            updateData.fileId = blogUpload.fileId;
        }

        // 5. Save changes to Database
        await BlogModel.findByIdAndUpdate(id, updateData);

        return NextResponse.json({ success: true, msg: "Blog Updated Successfully" });

    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function DELETE(request){
  try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const blog_id = request.nextUrl.searchParams.get('id');
        const blog = await BlogModel.findById(blog_id);

        if (!blog) {
            return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
        }

       const blogAuthorId = blog.authorId._id ? blog.authorId._id.toString() : blog.authorId.toString();
       const isOwner = blogAuthorId === session.user.id;
       const isAdmin = session.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ msg: "Forbidden: You don't own this post" }, { status: 403 });
        }

        await imageKit.deleteFile(blog.fileId);
        await BlogModel.findByIdAndDelete(blog_id);

        return NextResponse.json({ msg: "Blog deleted successfully", success: true });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}