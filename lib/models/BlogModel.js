import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    fileId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    
    // THE LINKING FIELD
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Matches: mongoose.model("User", UserSchema)
        required: true,
    },

    // OPTIONAL: Keep these as backups, but the UI will now pull from authorId
    author: { type: String, required: true },
    authorImg: { type: String, required: true },
});

const BlogModel = mongoose.models.blog || mongoose.model('blog', Schema);
export default BlogModel;