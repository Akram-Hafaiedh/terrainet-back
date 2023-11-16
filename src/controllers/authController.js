// import passport from "passport";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
// import 'dotenv/config';
import { generateToken, sanitizeUser } from "../config/utils.js";


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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!password || !email) {
            return res.status(401).json({ message: 'Email and password are required !' })
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            // NOTE: 401 : Unauthorized
            return res.status(401).json({ messsage: 'Invalid credentials' });
            // return res.status(401).json({ messsage: 'Invalid credentials', details: 'User dont exist' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            // NOTE: 401 : Unauthorized
            return res.status(401).json({ message: 'Invalid credentials' });
            // return res.status(401).json({ message: 'Invalid credentials', details: 'password is incorrect' });
        }

        // if the credentials are valid , generate the JWT token
        const token = generateToken(user);

        //Return the token to the client
        res.status(200).json({ token });
    } catch (error) {
        console.log('Error during login:', error);
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}


export const logout = async (req, res) => {
    console.log('logout');
}


