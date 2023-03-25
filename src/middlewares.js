import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    // 로그인을했다면 local객체값 변경
    // if (req.session.loggedIn) {
    //     res.locals.loggedIn = true;
    //     res.locals.loggedInUser = req.session.user || {};
    // }
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
};

// 로그인하지않은 사용자가 프로필경로를 타도 들어가지못하게 막도록하는 미들웨어
export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Login First");
        return res.redirect("/login");
    }
};

// 비회원만 들어갈 수 있게 (로그인페이지같은)
export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
}

// github로 로긴하면 무언가를 보여주지않거나, 보여주거나 하는 middleware


// multer Middleware작성
export const multerMiddlewareforAvatar = multer({
    // destination 파일을 어디에 보낼지 정하자.
    dest: "uploads/avatars/", // 업로드파일 저절로생김.. 디렉토리에
    limits: {
        fileSize: 3000000, // byte
    }
})

export const multerMiddlewareforVideo = multer({
    dest: "uploads/videos/",
    limits: {
        fileSize: 100000000,
    }
})