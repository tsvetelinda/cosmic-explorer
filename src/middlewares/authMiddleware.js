import { AUTH_COOKIE_NAME } from "../constants.js";
import jwt from "../lib/jwt.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies[AUTH_COOKIE_NAME];

    if (!token) {
        return next();
    }

    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;
        req.isAuthenticated = true;

        res.locals.user = decodedToken;
        res.locals.isAuthenticated = true;

        next();
    } catch(err) {
        res.clearCookie(AUTH_COOKIE_NAME);
        return res.redirect('/login');
    }
};

export const isGuest = (req, res, next) => {
    if (req.user) {
        return res.redirect('/');
    }
    next();
};

export const isAuth = (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
    }
    next();
}