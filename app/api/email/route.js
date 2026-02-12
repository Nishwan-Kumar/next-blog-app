import { connectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request){
    await connectDB();
    try{
        const formData = await request.formData();
        const emailData = {
            email:`${formData.get('email')}`,
        }
        await EmailModel.create(emailData)
        return NextResponse.json({
            success:true,
            msg:"Email Subscribed"
        })
    }catch(err){
        console.error(err)
        return NextResponse.json({error:"Internal server Errror while Subscribing"},{status:400})
    }
    
}

export async function GET(request){
    try{
        const emails = await EmailModel.find({});
        return NextResponse.json({emails})
    }catch(err){
        console.error(err)
        return NextResponse.json({error:"Internal server Errror while getting"},{status:400})
    }
    
}

export async function DELETE(request){
    const id = await request.nextUrl.searchParams.get("id");
    try{
        await EmailModel.findByIdAndDelete(id);
        return NextResponse.json({success:true,msg:"Email Deleted"})
    }catch(err){
        console.error(err)
        return NextResponse.json({error:"Error deleting email"},{status:500})
    }
}