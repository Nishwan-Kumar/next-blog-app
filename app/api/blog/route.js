import { connectDB } from "@/lib/config/db"
import { NextResponse } from "next/server"
import imageKit from "@/lib/config/imagekit";
import BlogModel from "@/lib/models/BlogModel";


export async function GET(request) {
    try {
        await connectDB(); // Ensure connection is active
        const blogId = request.nextUrl.searchParams.get("id");
        if(blogId){
            const blog = await BlogModel.findById(blogId)
            return NextResponse.json(blog)
        }else{
            const blogs = await BlogModel.find({});
            return NextResponse.json({ blogs });
        }        
    } catch (error) {
        return NextResponse.json({ error: "DB connection failed" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        // Ensure DB is connected
        await connectDB();
        const formData = await request.formData();

        const title = formData.get('title')
        const authorName = formData.get('author')
        const blogImage = formData.get('image')

        if (!title || !blogImage || !authorName) {
            return NextResponse.json(
                { error: "Title, blog image and author are required" },
                { status: 400 }
            );
        }

        const uploadToImageKit = async (file, folder, namePrefix) => {

            if (!file || typeof file.arrayBuffer !== 'function') {
                console.error("Invalid file object received:", file);
                throw new Error("The provided file is not a valid uploadable object.");
            }
            const byteData = await file.arrayBuffer();
            const buffer = Buffer.from(byteData);

            try{
                return await imageKit.upload({
                file: buffer,
                fileName: `${namePrefix}-${file.name}`,
                folder
            });
            }catch (ikError) {
                console.error("ImageKit Connection Error:", ikError.message);
                throw ikError;
            }
        };


        const blogUpload = await uploadToImageKit(blogImage, "/Blog-App/blog-images", Date.now());


        const newBlog = new BlogModel({
            title:title,
            description : `${formData.get('description')}`,
            category : `${formData.get('category')}`,
            author : authorName,
            image : blogUpload.url,
            fileId: blogUpload.fileId,
            authorImg : `${formData.get('authorImg')}`
        });

        await newBlog.save();

        return NextResponse.json({ 
            msg: "Blog Created Successfully", 
            blogUrl: blogUpload.url 
        });

    } catch (error) {
        console.error("Error in POST /api/blog:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request){
    const blog_id = request.nextUrl.searchParams.get('id');

    const blog = await BlogModel.findById(blog_id)

    if (blog) {
        try {
            await imageKit.deleteFile(blog.fileId);
            
            await BlogModel.findByIdAndDelete(blog_id);

            return NextResponse.json({ msg: "Blog deleted successfully", success: true });
        } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
        }
    } else {
        return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
    }
}