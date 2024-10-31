import { Router } from 'express';
import authService from '../services/authService.js';
import { AUTH_COOKIE_NAME } from '../constants.js';
import { getErrorMessage } from '../utils/errorUtils.js';
import { isGuest, isAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register' });
});

router.post('/register', isGuest, async (req, res) => {
    const { username, email, password, rePassword } = req.body;

    try {
        const token = await authService.register(username, email, password, rePassword);
        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });

        res.redirect('/');
    } catch(err) {
        const error = getErrorMessage(err);
        res.render('auth/register', { title: 'Register', username, email, error });
    }
});

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login' });
});

router.post('/login', isGuest, async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await authService.login(username, password);

        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });
    
        res.redirect('/');
    } catch(err) {
        const error = getErrorMessage(err);
        
        res.render('auth/login', { title: 'Login', error, username });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);

    res.redirect('/');
});

export default router;