import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGO_DB_URL

if (!MONGODB_URL){
    throw new Error("Please define an URL in .env")
}

let cached = global.mongoose
if(!cached){
    cached =  global.mongoose={
        conn:null,
        promise:null
    };
}
export const connectDB = async ()=>{
    if (cached.conn) return cached.conn

    if(!cached.promise){
        cached.promise = await mongoose.connect(MONGODB_URL).then((mongoose)=>{
            console.log("Connected to database")
            return mongoose;
        })
    }
    cached.conn = await cached.promise
    return cached.conn
    
}

