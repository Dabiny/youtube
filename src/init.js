import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";


// listen의 callback함수는 서버가시작될때 작동하는 함수다. 
const handleListening = () => console.log("Server listening on port 4000");
app.listen(4000, handleListening);
