import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    image: {
        type: String,
        default: "/author_img.png",
        required:true // You can also set a default placeholder URL here
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        default: "user", 
        enum: ["user", "admin"] // This enforces strict role-based access
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpire: {
        type: Date,
        default: undefined
    }

}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;