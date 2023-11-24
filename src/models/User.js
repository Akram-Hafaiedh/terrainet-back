import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Invalid email format'], },
    username: { type: String, required: true },
    password: { type: String, required: true },
    picture: { type: String },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }, // Reference to Profile, One-to-One
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }], // Array of Reservation Reference: One-To-Many
    roles: { type: [String], enum: ['user', 'admin', 'moderator', 'guest'], default: ['user'] },
}, { timestamps: true });

// Create a unique index on the email field
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
    next();
})


const User = mongoose.model('User', userSchema);
export default User;
