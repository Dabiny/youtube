import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

const fakeUser = {
    username: "dabin",
    loggedIn: false,
};

export const watchVideos = async (req, res) => {
    // async/await 버전
    try {
        const videos = await Video.find({})
            .sort({ createdAt: "desc" })
            .populate("owner"); // asc오름차순
        //console.log(videos);
        return res.render("home", {
            pageTitle: "Home", // 변수 재정의
            fakeUser: fakeUser,
            videos,
        });
    } catch {
        return res.render("server error");
    }
}; // home.pug
// Failed to lookup view "home" in views directory 에러
// "/Users/dabinkim/Documents/nomad/youtube/views"
// express가 views 디랙토리에서 home이라는 파일을 찾아봤는데 실패했다는 뜻.
// 실제로는 wetube/src/views를 찾아야한다. 기본적은 위경로인데 src안에 찾으려면 expres설정해줘야함.

export const see = async (req, res) => {
    const { id } = req.params;
    //mongoose.findById()로 특정데이터를 찾아보자
    // populate: owner의 id를 ref한 부분을 User데이터로 채워준다.
    const video = await Video.findById(id).populate("owner").populate("comments");
    // video 오우너 찾기
    // const owner = await User.findById(video.owner);
    // 예외처리 필수
    if (!video) {
        return res.render("404", {
            pageTitle: "Video not found. 404",
        });
    }
    return res.render("see", {
        //see.pug
        pageTitle: video.title,
        id: id,
        video: video,
        // user
        // owner
    });
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);

    if (!video) {
        return res.render("404", {
            pageTitle: "Video not found. 404",
        });
    }

    // edit form이 이 영상 주인에게만 나타나도록 하기
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }

    return res.render("edit", {
        pageTitle: `Edit ${video.title}`,
        video: video,
    });
};

// 변경사항 저장 Edit
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.sataus(404).render("404", {
            pageTitle: "Video not found. 404",
        });
    }
    await Video.findByIdAndUpdate(id, {
        title: title,
        description: description,
        hashtags: Video.formatHashtags(hashtags),
    });

    // form으로부터 정보를 얻고싶을때 (input name, value,,,)
    // server에서 extend설정해주기

    // save를 누르면 see페이지로 돌아가는 것
    return res.redirect(`/videos/${id}`);
    // 브라우저가 res.redirect(자동으로 이동)
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = []; // find가 배열반환해주기때문에 재할당을 해야함.

    // 예외처리
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"), // 검색설정 여러쿼리가있음. mongoDB참조
            },
        }).populate("owner");
    }
    return res.render("search", {
        pageTitle: "Search",
        videos: videos,
    });
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    // populate 쓰면 user전체 오브젝트 가져온다. 우리는 id만 체크할거니까 굳이안서도댐
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", {
            pageTitle: "Video not found. 404",
        });
    }
    // edit form이 이 영상 주인에게만 나타나도록 하기
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    // delete, remove 차이점
    // delete권장. remove는 mongoDB데이터를 다시되돌릴수 없기 때문에 remove보단 delete쓰란말.
    await Video.findByIdAndDelete(id);

    return res.redirect("/videos/watch");
};

export const getUpload = (req, res) => {
    return res.render("upload", {
        pageTitle: "Upload video",
    });
};

export const postUpload = async (req, res) => {
    // es6 정의방법
    // const { path: fileUrl } = req.file; // file은 single
    const { video, thumb } = req.files; // files은 fields
    const {
        user: { _id },
    } = req.session;
    const { title, description, hashtags } = req.body;

    // 방법 1.
    // documents 만들기, _id는 mongoose가 부여해줌.
    // const video = new Video({
    //     title: title,
    //     description: description,
    //     hashtags: hashtags.split(",").map((word) => `#${word}`),
    //     createdAt: Date.now(),
    //     meta: {
    //         views: 0,
    //         rating: 0,
    //     },
    // });

    // // mongoDB에 저장 save는 return promise한다.
    // const dbVideo = await video.save();

    // 방법 2. new안쓰고 create로 바로 db에 저장하는법.
    // 이상한값으로 에러가있을 수 있으니 try/catch로 잡아주자.
    console.log(thumb);
    try {
        // #8 create는 return 해준다.
        const newVideo = await Video.create({
            title: title,
            description: description,
            // 지금에선 완벽한 코드지만 수정할때는 다르다.
            // 수정할때의 form은 업로드 form과 생긴건 똑같지만 다르다.
            // 또 새러운 hashtag가 생길텐데 그거에대한 대응을 해줘야한다. (나중에 설명)
            hashtags: Video.formatHashtags(hashtags),
            fileUrl: video[0].path,
            thumbUrl: thumb[0].filename,
            // ⭐️소유자: id
            owner: _id,
        });
        //#8 이제는 업로드될 영상의 id를 user model에도 저장해줘야한다.
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();

        return res.redirect("/videos/watch");
    } catch (error) {
        console.log(error);
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }

    // here we will add a video to the videios array.
    //return res.redirect("/videos/watch");
};

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        // status만 보내고싶을때 sandStatus
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = async (req, res) => {
    const {
        session: { user },
        body: { text },
        params: { id },
    } = req;

    const video = await Video.findById(id);

    if (!video) {
        return res.sendStatus(404);
    }

    const comment = await Comment.create({
        text: text,
        owner: user._id,
        video: id,
    });

    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({
        newCommentId: comment._id,
    });
};
