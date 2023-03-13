const fakeUser = {
    username: "dabin",
    loggedIn: false,
};

export const watchVideos = (req, res) => {
    const videos = [
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
            id: 1,
        },
        {
            title: "Third Video",
            rating: 5,
            comments: 2,
            createdAt: "2 minutes ago",
            views: 59,
            id: 1,
        },
    ];

    return res.render("home", {
        pageTitle: "Home", // 변수 재정의
        fakeUser: fakeUser,
        videos
    });
}; // home.pug
// Failed to lookup view "home" in views directory 에러
// "/Users/dabinkim/Documents/nomad/youtube/views"
// express가 views 디랙토리에서 home이라는 파일을 찾아봤는데 실패했다는 뜻.
// 실제로는 wetube/src/views를 찾아야한다. 기본적은 위경로인데 src안에 찾으려면 expres설정해줘야함.

export const editVideos = (req, res) => res.send("Home Page Videos");
export const see = (req, res) => {
    res.render("see", {
        //see.pug
        pageTitle: "See",
        potato: "POTATO",
    });
};
export const edit = (req, res) => res.send("Edit Video");
export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => res.send("Delete Video");
