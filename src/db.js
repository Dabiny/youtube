import mongoose from "mongoose";
// 
mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
// on은 여러번 계속 발생가능, 클릭이벤트가튼애
db.on("error", (err) => console.log("DB Error", err));
// once 오로지 한번만 가능하다는뜻
db.once("open", handleOpen);

// 우리의 db를 만든 목표 CRUD : C(create), R(read), U(update), D(delete)

