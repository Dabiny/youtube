// 비디오모델 만들기
// 비디오가 어떻게 생겼는지 mongoose에게 알려준다.

import mongoose from "mongoose";

// 비디오 형식 정의
// 필수로 받아와야하는 데이터는 require키워드를 써서 받아오자.
const videoSchema = new mongoose.Schema({
    // maxLength, minLength 설정시 html input값에도 설정을 넣어주어야한다.
    // 왜 굳이 html에만 넣어도되는데 db까지 명시해주어야할까 이에대답은 둘다 해야한다는 것.
    // 하나는 사용자의것. 만약 누군가가 나의 홈페이지를 해킹한다면 html에 들어가서 html code가 사라질 수 있음.
    // 우린 그들로부터 보호해야하니까 db에서도 명시를 해주어야한다. 이중보호

    title: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        maxLength: 80,
    },
    fileUrl: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    // mongoose는 내가 새로운 video를 생성했을때만 실행시킬것임. (Date.now)
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },
    },
    // ref : monggose에게 owner에 id를 저장하겠다고 알려주는 신호
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Comment",
        },
    ],
});

// middleware 사용자화
videoSchema.static("formatHashtags", function (hashtags) {
    return hashtags
        .split(",")
        .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

// model 정의

const videoModel = mongoose.model("Video", videoSchema);
export default videoModel;
