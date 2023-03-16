import User from "../models/User";
import bcrypt from "bcrypt";

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
    const user = await User.findOne({ username });
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
    
    // 세션기억
    req.session.loggedIn = true;
    req.session.user = user;
    
    return res.redirect("/");
};

export const logout = (req, res) => res.send("logout");
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
            password: password,
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
