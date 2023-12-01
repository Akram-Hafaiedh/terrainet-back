// import passport from "passport";
import User from "../models/User.js";
import { sanitizeUser } from "./userController.js";
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


const generateToken = (user) => {
    const payload = {
        user: {
            id: user._id,
            email: user.email,
            username: user.username,
            picture: user.picture
        }
    }
    const token = jwt.sign({ payload }, JWT_SECRET_KEY, { expiresIn: '6h' });
    return token;
}

const hanldeOAuthCallback = async (req, res) => {

    //TODO - This is gonna be used for authentication (Register - Login)
    //TODO - We should try to look if the user exists in database

    // console.log("🚀 ~ file: authRoutes.js:42 ~ req.user:", req.user)
    if (!req.user) {
        res.status(401).json({ message: 'Authentication failed' });
    }
    const existingUser = await User.findOne({ email: req.user.email })

    if (existingUser) {
        if (existingUser.picture) {
            // Only include the 'picture' field if it's present in the database
            userResponse.picture = existingUser.picture;
        }
        // User exists, perform login logic
        const token = generateToken(existingUser);
        return res.status(200).json(({ message: 'Login succesful', user: req.user, token }))
    } else {
        // User doesn't exist, perform registration logic
        const newUser = new User({
            email: req.user.email,
            username: req.user.username,
            // picture: req.user.picture
        })
        await newUser.save();

        const token = generateToken(req.user);
        if (newUser.picture) {
            // Only include the 'picture' field if it's present in the database
            newUser.picture = newUser.picture;
        }
        // Return the token to the client
        return res.status(200).json({ message: 'Registration successful', user: newUser, token });
    }
}


export const authController = {
    async register(req, res) {
        console.log(req.body);
        try {
            const { email, password, username, passwordConfirmation } = req.body;
            console.log("🚀 ~ file: authController.js:12 ~ register ~ req.body:", req.body)

            if (!password || !passwordConfirmation) {
                // NOTE - 400 : Bad request
                return res.status(400).json({ message: 'Password and password-confirmation are required' });
            }
            if (password !== passwordConfirmation) {
                // NOTE - 400 : Bad request
                return res.status(400).json({ message: 'Passwords must match' });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log(existingUser);
                // NOTE - 400 : Bad request
                return res.status(400).json({ message: 'Email aready exists' });
            }

            const newUser = new User({
                email,
                password,
                username
            });
            await newUser.save();
            await User.createIndexes();

            const sanitizedUser = sanitizeUser(newUser);
            const token = generateToken(newUser);
            // res.status(201).json({ user, token });


            res.status(201).json({
                message: 'Authenticated succesfully',
                user: sanitizedUser,
                token,
            });
        } catch (error) {
            console.log('Error during registration:', error);
            // res.status(400).json({ message: error.message })
            if (error.code === 11000) {
                // Duplicate key error (unique constraint violation)
                // NOTE - 409 : Conflict
                return res.status(409).json({ message: 'Email address must be unique' });
            } else if (error.name === 'ValidationError') {
                // Mongoose validation error (eg: invalid email format)
                // NOTE - 400 : Bad request 
                return res.status(400).json({ message: error.message })
            } else {
                // res.status(500).json({ message: error.message })
                // NOTE - 500 : Internal server error
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    },
    async login(req, res, next) {
        console.log(req.body);
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                // NOTE: 401 : Unauthorized
                return res.status(401).json({ message: info.message });
            }
            // If authentication is successful, manually log in the user
            // Passport adds this method to the request object
            req.login(user, { session: false }, async (err) => {
                if (err) {
                    console.log(err);
                    // NOTE - 500 : Internal server error 
                    return res.status(500).json({ message: 'Internal Server Error' });

                }

                // Send a success response with user data or a token
                const token = generateToken(user);
                const sanitizedUser = sanitizeUser(user);
                console.log({ user, token });
                // generate Token
                return res.status(200).json({
                    message: 'Login succesful',
                    token,
                    user: sanitizedUser,
                });
            });
        })(req, res, next)
    },
    async logout(req, res) {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server Error during logout' })
            }
            res.status(200).json({ message: 'Logout successful' });
            // Passport adds this method to the request object
        });
    },
    async googleCallback(req, res) {
        hanldeOAuthCallback(req, res);
    },
    async facebookCallback(req, res) {
        hanldeOAuthCallback(req, res);
    },
    async githubCallback(req, res) {
        hanldeOAuthCallback(req, res);
    },
}



