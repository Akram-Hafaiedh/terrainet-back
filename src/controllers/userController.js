import { sanitizeUser } from "../config/utils.js";
import User from "../models/User.js"


// Create a new user
export const createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({
            username,
            password,
            email
        });
        await newUser.save();
        await User.createIndexes();
        // sanitize user data before sanding it in the response
        const sanitizedUser = sanitizeUser(newUser);
        res.status(201).json(sanitizedUser);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email adress must be unique' });
        } else {
            // res.status(400).json(error)
            res.status(400).json({ message: error.message })
        }
    }
}
//Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// get a specific user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        // res.status(404).json({ message: error.message })
        res.status(404).json({ message: 'User not found' })
    }
}

// update a user by iD
export const updateUserById = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        // res.status(404).json({ message: error.message })
        res.status(404).json({ message: 'User not found' })
    }
}

// Delete a user by ID
export const deleteUserById = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        // res.status(404).json({ message: error.message })
        res.status(404).json({ message: 'User not found' })
    }
}


// relationship One-to-Many ( User  - Reservation )

export const getUserReservations = async (req, res) => {
    try {
        // eager loding the reservations with the user
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // console.log("🚀 ~ file: userController.js:77 ~ getUserReservations ~ userId:", userId)
        // console.log("🚀 ~ file: userController.js:78 ~ getUserReservations ~ page:", page)
        // console.log("🚀 ~ file: userController.js:79 ~ getUserReservations ~ limit:", limit)

        const user = await User.findById(userId).populate({
            path: 'reservations',
            options: {
                skip: (page - 1) * limit,
                limit: limit,
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.reservations) {
            console.error('Error populating reservations:', user);
            return res.status(500).json({ messsage: 'Error populating reservations' })
        }
        const reservations = user.reservations;

        // res.status(200).json(user.reservations);
        res.status(200).json({
            totalReservations: reservations.length,
            currentPage: page,
            totalPages: Math.ceil(reservations.length / limit),
            reservations: reservations.slice((page - 1) * limit, page * limit)
        });

    } catch (error) {
        console.error('Error fetching user reservations:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getUserReservationById = async (req, res) => {
    try {
        const { userId, reservationId } = req.params

        const user = await User.findById(userId).populate({
            path: 'reservations',
            match: { '_id': reservationId },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const reservation = user.reservations.find((r) => r._id.equals(reservationId))
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found for the user' });
        }
        res.status(200).json(reservation)
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error);
    }
}