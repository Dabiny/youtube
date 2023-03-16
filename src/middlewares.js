export const localsMiddleware = (req, res, next) => {
    console.log(req.session);
    if(req.session.loggedIn) {
        res.locals.loggedIn = true;
        res.locals.loggedInUser = req.session.user;
    }
    console.log(res.locals);
    next();
}