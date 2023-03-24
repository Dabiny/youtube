const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    // a property는 download 메서드를 가지고있음.
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();
}

const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    
    recorder.stop();

}

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream, {
        mimeType: "video/mp4",
    });
    // stop후 이벤트발동. BlobEvent를 받을거다. 
    // data를받으면 다운가능.
    recorder.ondataavailable = (event) => {
        console.log(event.data);
        // 브라우저에 의해서 브라우저 메모리에서만 가능한 URL을 만들어준다. 그리고 이 URL은 파일을 가리킨다. 
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    }

    recorder.start();
}

/**
 * MediaDevices.getUsrMedia() MDN 참조
 * srcObject: 비디오가 가질수있는 무언가를 이야기함.
 */
const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject = stream;
    video.play();
}
init();
startBtn.addEventListener("click", handleStart);