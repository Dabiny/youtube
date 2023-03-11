export const watchVideos = (req, res) => res.render("home"); // home.pug
// Failed to lookup view "home" in views directory 에러
// "/Users/dabinkim/Documents/nomad/youtube/views" 
// express가 views 디랙토리에서 home이라는 파일을 찾아봤는데 실패했다는 뜻. 
// 실제로는 wetube/src/views를 찾아야한다. 기본적은 위경로인데 src안에 찾으려면 expres설정해줘야함. 


export const editVideos = (req, res) => res.send("Home Page Videos");
export const see = (req, res) => {
    console.log(req.params);
    return res.send(`Watch`);
}
export const edit = (req, res) => res.send("Edit Video");
export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => res.send("Delete Video");