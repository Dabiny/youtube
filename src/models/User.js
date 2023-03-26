import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl: String,
    githubLoginOnly: { type: Boolean, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    location: String,
    // Video model referance
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video"}],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
});

userSchema.pre("save", async function () {
    // password값이 바뀌면 true
    if(this.isModified("password")) {
        // this.password를 5번 해싱한다.
        this.password = await bcrypt.hash(this.password, 5);
    }
});

const User = mongoose.model("User", userSchema);
export default User;
