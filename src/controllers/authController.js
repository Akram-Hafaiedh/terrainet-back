// import passport from "passport";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
// import { Strategy as LocalStrategy } from "passport-local";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'qzdqzdqzdzadqzdqd1656854';

export const signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        const user = new User({ email, password, username })
        await user.save();

        const token = generateToken(user);
        // res.status(201).json({ user, token });
        res.status(201).json({ message: 'Authenticated succesfully' });
    } catch (error) {
        // res.status(400).json({ message: error.message })
        res.status(500).json({ message: 'Internal Server Error' })
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = new User.findOne({ email });
        if (!user) {
            // NOTE: 401 : Unauthorized
            return res.status(401).json({ messsage: 'Invalid credentials', details: 'User dont exist' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            // NOTE: 401 : Unauthorized
            return res.status(401).json({ message: 'Invalid credentials', details: 'password is incorrect' });
        }

        // if the credentials are valid , generate the JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
        //Return the token to the client
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
}