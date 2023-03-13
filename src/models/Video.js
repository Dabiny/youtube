// 비디오모델 만들기
// 비디오가 어떻게 생겼는지 mongoose에게 알려준다. 
import mongoose from "mongoose";

// 비디오 형식 정의
const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: Date,
    hashtags: [{ type: String }],
    meta: {
        views: Number,
        rating: Number,
    },
});

// model 정의
const videoModel = mongoose.model("Video", videoSchema);
export default videoModel;




