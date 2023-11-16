// import passport from "passport";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
// import 'dotenv/config';
import { generateToken, sanitizeUser } from "../config/utils.js";
import passport from "passport";


export const register = async (req, res) => {
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

        // const sanitizedUser = sanitizeUser(newUser);
        // const token = generateToken(newUser);
        // res.status(201).json({ user, token });


        res.status(201).json({
            message: 'Authenticated succesfully',
            user: sanitizeUser(newUser),
            token: generateToken(newUser),
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
};

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // NOTE: 401 : Unauthorized
            return res.status(401).json({ message: info.message });
        }
        // If authentication is successful, manually log in the user
        req.login(user, (err) => {
            if (err) {
                // NOTE - 500 : Internal server error 
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            const token = generateToken(user);
            // Send a success response with user data or a token
            return res.status(200).json({ message: 'Authentication successful', user, token });
        });
        // generate Token
        // return res.status(200).json({ token });
    })(req, res, next)
}



export const logout = async (req, res) => {
    console.log('logout');
}


