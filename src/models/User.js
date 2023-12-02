import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Invalid email format'], },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }, // Reference to Profile, One-to-One
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }], // Array of Reservation Reference: One-To-Many
    matchmakingPreferences: {
        nearby: { type: Boolean, default: true },
        location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
        gameType: { type: String },
    },
    points: { type: Number, default: 0 },
    eventsParticipated: [
        {
            eventName: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
            participationDate: { type: Date }
        },
    ],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    roles: [{ type: String, enum: ['user', 'admin', 'moderator', 'guest'], default: 'user' }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Create a unique index on the email field
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
    try {
        const user = this;
        if (!user.isModified('password')) return next();

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }

})


const User = mongoose.model('User', userSchema);
export default User;
