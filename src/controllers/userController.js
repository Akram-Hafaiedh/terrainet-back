import Profile from "../models/Profile.js";
import User from "../models/User.js"

export const sanitizeUser = (user) => {
    const { _id, password, createdAt, updatedAt, __v, ...sanitizedUser } = user.toObject();
    return { id: _id, ...sanitizedUser };
};


export const userController = {
    //* Create a new user
    async createUser(req, res) {
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
    },
    // create multiple users
    async createMultipleusers(req, res) {
        try {
            const usersData = req.body;

            if (
                !usersData ||
                !Array.isArray(usersData) ||
                usersData.length === 0
            ) {
                return res.status(400).json({ message: 'Invalid or empty users data' });
            }
            // Validate each user object
            for (const user of usersData) {
                console.log(user);
                if (
                    !user.username ||
                    !user.password ||
                    !user.email
                    // more validation if needed
                ) {
                    // NOTE - 400 : Bad request
                    return res.status(400).json({ message: 'Invalid user data. All fields are required' });
                }
                const isEmailUnique = await User.findOne({ email: user.email });
                if (isEmailUnique) {
                    return res.status(400).json({ message: `Email address '${user.email}' must be unique` });
                }
            }
            const createdUsers = await User.create(usersData);
            // sanitize user data before sending it in the response
            const sanitizedUsers = createdUsers.map(user => sanitizeUser(user));
            res.status(201).json(sanitizedUsers)
        } catch (error) {
            // Handle other errors
            res.status(400).json({ message: error.message });
        }
    },
    //Get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // get a specific user by Id
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            res.status(200).json(user);
        } catch (error) {
            // res.status(404).json({ message: error.message })
            res.status(404).json({ message: 'User not found' })
        }
    },
    // update a user by Id
    async updateUserById(req, res) {
        try {
            const userId = req.params.userId;
            const newUserData = req.body;
            const currentUser = await User.findById(userId);
            // check if updated email is the same as the current email
            if (currentUser.email === newUserData.email) {
                return res.status(400).json({ message: 'The new email is the same as the current email.' });
            }
            // check if the new email is already used by another user
            const existingUserWithNewEmail = await User.findOne({ email: newUserData.email, _id: { $ne: userId } })
            if (existingUserWithNewEmail) {
                return res.status(400).json({ message: 'Email address is already in used by another user' });
            }
            // Update the user
            const updatedUser = await User.findByIdAndUpdate(
                req.params.userId,
                req.body,
                { new: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            // res.status(404).json({ message: error.message })
            res.status(404).json({ message: error.message })
        }
    },
    //! TODO
    // change password
    async changeUserPassword(req, res) {
        console.log('Change password');
    },
    // Delete a user by ID
    async deleteUserById(req, res) {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId);
            const profile = await Profile.findOne({ user: userId });

            if (!user || !profile) {

            }
            await User.findByIdAndDelete(req.params.id);
            res.status(204).end();
        } catch (error) {
            // res.status(404).json({ message: error.message })
            res.status(404).json({ message: 'User not found' })
        }
    },
    // get user profile by user ID
    async getUserProfile(req, res) {
        try {
            const userId = req.params.userId;
            // Find the user profile
            const profile = await Profile.findOne({ user: userId });
            if (!profile) {
                return res.status(404).json({ message: 'Pofile not found for this user' })
            }
            res.status(200).json(profile);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message })
        }
        // res.status(200).json({ message: 'get user profile' })
    },
    //update user profile by userID
    async updateUserProfile(req, res) {
        try {
            const userId = req.params.userId;
            // find the user profile
            const profile = await Profile.findOne({ user: userId });
            if (!profile) {
                return res.status(404).json({ message: 'Pofile not found for this user' });
            }
            const updatedProfile = await Profile.findByIdAndUpdate(
                { user: userId },
                req.body,
                { new: true }
            );

            res.status(200).json(updatedProfile);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        // res.status(200).json({ message: 'update user profile' })
    },
    async deleteUserProfile(req, res) {
        try {
            const userId = req.params.userId;
            // find and delete the user profile
            const deletedProfile = await Profile.findOneAndDelete({ user: userId });
            if (!deletedProfile) {
                return res.status(404).json({ message: 'Profile not found for this user' });
            }
            // NOTE - 204 : No Content , no content to send for this request
            res.status(204).end()
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        res.status(200).json({ message: 'delete user profile' })
    }
}
//! TODO
export const userPlaceController = {
    async getUserfavoritePlaces(req, res) {
        console.log('Favorite places for a user')
    },
    async addUserFavoritePlace(req, res) {
        console.log('add to favorites');
    },
    async deleteUserFavorite(req, res) {
        console.log('delete from favorites');
    },
}

// relationship One-to-Many ( User  - Reservation )
export const userReservationController = {
    async getUserReservations(req, res) {
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
    },
    async getUserReservationById(req, res) {
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
}

//! TODO
export const userEventController = {
    async participateToEvent(req, res) {
        console.log('join an event');
    }
}