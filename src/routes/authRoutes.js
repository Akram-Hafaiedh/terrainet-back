import express from 'express';

import { authController } from '../controllers/authController.js';
import passport from '../config/passport.js';
import dashboardRouter from './dashboardRoutes.js';
import authenticateToken from '../middlewares/authenticateToken.js';



const router = express.Router();


router.use('/register', authController.register);
router.use('/login', authController.login)
router.use('/logout', authController.logout)



//protected with JWT
// router.get('/protected', authenticateToken, (req, res) => {
//     res.json({ message: 'This is protected data', user: req.user });
// });

// Google login route
// Initiate the authentication
router.get('/google',
    passport.authenticate('google', { session: false })
);
//handle the callback from Google
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
    }),
    authController.googleCallback
);

// Facebook login route
router.get('/facebook',
    passport.authenticate('facebook', {
        session: false
    })
);
// handle the callback from Facebook
router.get('/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    authController.facebookCallback
);

// Facebook login route
router.get('/github',
    passport.authenticate('github', {
        session: false
    })
);
// handle the callback from Facebook
router.get('/github/callback',
    passport.authenticate('github', { session: false }),
    authController.githubCallback
);

export default router;