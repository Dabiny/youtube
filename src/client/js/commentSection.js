const form = document.getElementById("commentForm");
// const button = form.querySelector("button");
const videoContainer = document.getElementById("videoContainer");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video_comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.className = "video_comment";

    videoComments.prepend(newComment);
};

// form안에있는 버튼을 클릭시 form이 제출되는것이다. 그래서 깜빡임현상생김.
const handleSubmit = async (event) => {
    event.preventDefault(); // 브라우저가 항상하는(깜빡임)것을 방지.
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") return;
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            // json string이라고 알려주기 #16.4
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: text,
        }),
    });
    textarea.value = "";
    const json = await response.json();
    if (response.status === 201) {
        addComment(text, json.newCommentId);
    }

    // window.location.reload(); // reload말고 가짜데이터만들어보기
};

if (form) {
    //1. 사용자가 뭔가 작성하고 버튼누르면 등록
    form.addEventListener("submit", handleSubmit);
}
