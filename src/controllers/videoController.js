const fakeUser = {
    username: "dabin",
    loggedIn: false,
};
let videos = [
    {
        title: "First Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 1,
    },
    {
        title: "Second Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 2,
    },
    {
        title: "Third Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 1,
        id: 3,
    },
];

export const watchVideos = (req, res) => {
    return res.render("home", {
        pageTitle: "Home", // 변수 재정의
        fakeUser: fakeUser,
        videos,
    });
}; // home.pug
// Failed to lookup view "home" in views directory 에러
// "/Users/dabinkim/Documents/nomad/youtube/views"
// express가 views 디랙토리에서 home이라는 파일을 찾아봤는데 실패했다는 뜻.
// 실제로는 wetube/src/views를 찾아야한다. 기본적은 위경로인데 src안에 찾으려면 expres설정해줘야함.

export const getEdit = (req, res) =>{
    const { id } = req.params;
    const video = videos[id - 1];

    return res.render("edit", {
         pageTitle: `Editing ${video.title}`,
         fakeUser: fakeUser,
         video
     });
}
export const see = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1]; // index
    return res.render("see", {
        //see.pug
        pageTitle: `See the ${video.title}`,
        potato: "POTATO",
        fakeUser: fakeUser,
        video
    });
};

// 변경사항 저장 Edit
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { potato } = req.body;

    // form으로부터 정보를 얻고싶을때 (input name, value,,,)
    // server에서 extend설정해주기
    console.log(req.body);

    // 가짜데이터 바꾸기
    videos[id - 1].title = potato;

    // save를 누르면 see페이지로 돌아가는 것
    return res.redirect(`/videos/${id}`);
    // 브라우저가 res.redirect(자동으로 이동)
};
export const search = (req, res) => res.send("Search Video");
export const deleteVideo = (req, res) => res.send("Delete Video");

export const getUpload = (req, res) => {
    return res.render("upload", {
        pageTitle: "Upload video"
    });
}

export const postUpload = (req, res) => {
    const { title } = req.body;

    const newVideo = {
        title,
        rating: 0,
        comments: 0,
        createdAt: "just now",
        views: 0,
        id: videos.length + 1,
    }
    videos.push(newVideo);

    console.log(req.body);
    // here we will add a video to the videios array.
    return res.redirect("/videos/watch");
}