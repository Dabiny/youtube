import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const editUser = (req, res) => res.send("Join");
export const deleteUser = (req, res) => res.send("Join");

export const getLogin = (req, res) => {
    return res.render("login", {
        pageTitle: "Login",
    });
};
export const postLogin = async (req, res) => {
    const { username, password } = req.body;

    // first check if account,password exists
    const user = await User.findOne({ username, githubLoginOnly: false });
    if (!user)
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "Check your username",
        });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "Wrong password",
        });

    // 세션기억 세션초기화부분
    // 이 설정들은 세션을 수정할대만 세션을 DB에 저장하고 쿠키를 넘겨주는 것이다.
    // 다른말로 하자면 back이 로그인한 사용자에게만 쿠키를 주도록 설정됐다는 말. (uninitalized)
    // 익명 사용자에게는 주지않음.
    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
};

export const logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};

export const see = (req, res) => res.send("see User");

export const getJoin = (req, res) =>
    res.render("join", {
        pageTitle: "Create Account",
    });
export const postJoin = async (req, res) => {
    const { name, username, email, password1, password2, location } = req.body;
    // const usernameExists = await User.exists({ username: username });
    // if (usernameExists) return res.render("join", {pageTitle: "Join", errorMessage: "this message is already username taken.."});
    // const emailExists = await User.exists({email: email});
    // if (emailExists) return res.render("join", {pageTitle: "Join", errorMessage: "this message is already email taken.."});

    // password확인
    if (password1 !== password2) {
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: `Password confirmation does not match..`,
        });
    }

    // $or operator를 써서 ||와 같은 효과를 볼 수 있다.
    const userExists = await User.exists({
        $or: [{ username: username }, { email: email }],
    });
    if (userExists) {
        // 패스워드 저장인식 못하게 code넣기
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: `This is already use..`,
        });
    }

    try {
        await User.create({
            name: name,
            username: username,
            email: email,
            password: password1,
            location: location,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error._message,
        });
    }

    // login페이지로 이동
    res.redirect("/login");
};

export const startGithubLogin = (req, res) => {
    // "https://github.com/login/oauth/authorize?client_id=480d84064ff4926f9e90&allow_signup=false&scope=user:email"

    // 깃헙이 원하는 파라미터로 전송해야한다. 키값 주의 (임의대로 X)
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };

    //URLSearchParams utility 하면 인코딩해서 나옴.
    // new URLSearchParams(config).toString()
    const params = new URLSearchParams(config).toString();
    const githubUrl = `https://github.com/login/oauth/authorize?${params}`;
    return res.redirect(githubUrl);
};

// code를 토큰으로 바꾸기 code만료기간은 10분이다.
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    // 깃헙 백엔드에 POST 요청으로 토큰을 받아와야한다. fetch 설치해야됨. nodejs에선 설치해야함.
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    // {"access_token":"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","token_type":"bearer","scope":"read:user,user:email"}
    // const json = await data.json();

    // 받아온토큰으로 처리하기
    if ("access_token" in tokenRequest) {
        // access api
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        // 깃헙 유저정보 get하기
        // email이 null일 수 있음. private거나 진짜 없거나.. null값을 대비해서 또 다른 request를 만들어야햔ㄷ.
        // then 안쓰이유 -> then쓰면서 fetch 다시해야하니까 , then지옥발생
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                method: "GET",
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        console.log(userData);

        // array형식으로 받아온다. [{}]
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                method: "GET",
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();

        // note필기 참조
        const emailObject = emailData.find(
            (email) => email.primary && email.verified
        );
        if (!emailObject) {
            return res.redirect("/login");
        }

        // db에 존재확인
        let existsUser = await User.findOne({ email: emailObject.email });
        if (!existsUser) {
            // create an account 계정을 생성해야함.
            // 만약 깃헙 프로필설정안하면 name이 없어서 name path를 찾을 수 없다함. 예외처리도해주자.
            existsUser = await User.create({
                name: userData.name ? userData.name : "Unknown",
                avatarUrl: userData.avatar_url,
                username: userData.login ? userData.login : emailObject.email,
                email: emailObject.email,
                password: "",
                githubLoginOnly: true,
                location: userData.location,
            });
        }

        // 쿠키부여해주기
        req.session.loggedIn = true;
        req.session.user = existsUser;
        return res.redirect("/");

    } else {
        return res.render("/login");
    }
};
