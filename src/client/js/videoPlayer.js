console.log("video player");

// video element와 오디오 element는 둘다 html media element로부터
// 상속받는다. 다양한 프로퍼티 존재 MDN 참조
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const mute = document.getElementById("mute");
const muteBtnIcon = document.querySelector("i");
const volumeRange = document.getElementById("volume");


const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMoveTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    // if video is playing, pause it
    if (video.paused) {
        video.play();
    } else {
        // else play the video
        // playBtn.innerText = "Play";
        video.pause();
    }
    // playBtn.innerText = video.paused ? "Play" : "Pause";
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handlePause = (e) => {
    playBtn.innerText = "Play";
};
const handlePlay = (e) => {
    playBtn.innerText = "Pause";
};

// 음소거가 됐는지 안됐는지 체크
const handleMute = (e) => {
    // 변화가 생기면 일어남.
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    // mute.innerText = video.muted ? "Unmute" : "Mute";
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

/**
 * change event는 내가 마우스를 놓았을대 일어난다. input event는 실시간으로 감지한다.
 * 메롱
 * */
const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;

    if (video.muted) {
        video.muted = false;
        mute.innerText = "Mute";
    }

    volumeValue = value;
    video.volume = value;
};

/**
 * Date object를 이용해서 속임수 만들기 00:00:00을 자르는 속임수
 */
const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substring(14, 19);

/**
 * video의 총시간 알기. 이 funtrion이 호출해서 비디오의 길이를 알 수 있기 때문에 따로 event인자없이도 정보추출가능하다.
 */
const handleLoadedMetadata = () => {
    // 미디어의 전체 길이를 초 단위로 double 값으로 반환합니다. 재생 가능한 미디어가 없을 경우 0을 반환합니다.
    totalTime.innerText = formatTime(Math.floor(video.duration));

    // timeline 길이 구해주기
    timeline.max = Math.floor(video.duration);
};

/**
 * timeupdate는 비디오시간이 변경되는걸 감지하는 event.
 * value -> 움직일대 변경되는 값.
 */
const handleTimeUpdate = () => {
    // currentTime 속성이 변경되는 시점에 발생합니다.
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

/**
 * video.currenTIme은 getter, setter속성이다.
 */
const handleTimelineChange = (event) => {
    video.currentTime = event.target.value;
};

/**
 * FullScreenAPI
 * fullscreenElement: 우리에게 element를 준다. 만약 null 반환시 풀스크린이 없다는 뜻.
 * fullscreen시 나가기함수 활성화 , !fullscreen시 requsetFullscreen
 */
const handleFullScreen = () => {
    const fullScreen = document.fullscreenElement;
    if (fullScreen) {
        document.exitFullscreen();
        // fullScreenBtn.innerText = "Enter full Screen";
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        // fullScreenBtn.innerText = "Exit full Screen";
        fullScreenIcon.classList = "fas fa-compress";
    }
};
const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMoveTimeout) {
        clearTimeout(controlsMoveTimeout);
        controlsMoveTimeout = null;
    }
    videoControls.classList.add("showing");
    // 3초 후 classname 삭제
    controlsMoveTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
    // clearTimeout(id);
};

playBtn.addEventListener("click", handlePlayClick);
mute.addEventListener("click", handleMute);
// function에서 play, pause를 바꿔줄 수도 있지만 이벤트를 사용할 수도 있다.
// video.addEventListener("pause", handlePause);
// video.addEventListener("play", handlePlay);

volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
