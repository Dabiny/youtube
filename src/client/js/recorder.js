import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

// 함수들이 함께 변수를 공유할수 있도록 전역에 빼주기
let stream;
let recorder;
let videoFile; // videoFile URL (Blob)

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};
const makeDownloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    // a property는 download 메서드를 가지고있음.
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};

const handleDownload = async () => {
    // 한번만 다운받을 수 있게 
    startBtn.removeEventListener("click", handleDownload);
    startBtn.innerText = "TranseRecording ...";
    startBtn.disabled = true;


    const ffmpeg = createFFmpeg({ log: true });
    // 웹사이트에서 다른 소프트웨어를 사용. (유저의 컴퓨터를 사용.)
    // SharedArrayBuffer is not defined 뜨면 서버에서 정책허용해주자.
    await ffmpeg.load();

    // 눈을감고 우리가 브라우저에 있다고 생각하지말고 폴더와 팔로 가득찬 컴퓨터 안에 있다고 생각하자.
    // 가상컴퓨터가 있다고 생각하자. (웹어셈블리를 사용하고 있기 때문에)
    // 3번째인자는 binary data를 전달해주자.
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    // recodring -> output.mp4로 변환 초당 60프레임으로
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);

    // -ss는 특정 시간대로 가게해줌 (섬네일용),"00:00:01" -> 특정시간대,  -frames:v -> 첫 프레임의 스크린샷을 찌거준다. "1": 장수
    await ffmpeg.run(
        "-i",
        "recording.webm",
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.thumb
    );

    // output으로 나온 파일을 읽어야함. unsigned int형식으로 되어있음. Unit8Array 방식
    // array가 모두 동영상 -> 이게 js가 파일을 나타내는 방식이다. blob을 만들어 js세계의 파일객체를 만든다. (binary정보파일)
    // raw data, binary data에 접근하려면 mp4File.buffer를 사용해야한다. 아니면 그냥 binary파일임..
    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);

    const mp4Blob = new Blob([mp4File.buffer, { type: "video/mp4" }]);
    const thumBlob = new Blob([thumbFile.buffer, { type: "image/jpg" }]);

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumBlob);

    // console.log(mp4File);
    makeDownloadFile(mp4Url, "MyRecording.mp4");
    makeDownloadFile(thumbUrl, "MyThumbnail.jpg");

    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    startBtn.disabled = false;
    startBtn.innerText = "Record Again";
    startBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop();
};

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
    });
    // stop후 이벤트발동. BlobEvent를 받을거다.
    // data를받으면 다운가능.
    recorder.ondataavailable = (event) => {
        // event.data에 binary data가 있는 파일일수도있는 이 데이터에 접근해야함.
        // createObjectURL 사용해서 파일을 참조가능.
        console.log(event.data);
        // 브라우저에 의해서 브라우저 메모리에서만 가능한 URL을 만들어준다. 그리고 이 URL은 파일을 가리킨다.
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };

    recorder.start();
};

/**
 * MediaDevices.getUsrMedia() MDN 참조
 * srcObject: 비디오가 가질수있는 무언가를 이야기함.
 * 페이지를 처음 들어갈때 실행되기 원한다. init()을 실행해서 빼주자.
 */
const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject = stream;
    video.play();
};
init();
startBtn.addEventListener("click", handleStart);
