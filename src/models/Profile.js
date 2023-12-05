import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true }, // Reference to User, One-to-One
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    bio: { type: String, default: 'This user hasn\'t added a bio yet' },
    profilePictureUrl: { type: String },
    coverPhoto: { type: String },
    interests: [{ type: String }],
    location: { type: String },
    hostedTournaments: { type: Number, default: 0 },
    ladderPoints: { type: Number, default: 0 },
    tournamentPoints: { type: Number, default: 0 },
    tournamentPrizes: [{ type: String }],
    isDeleted: { type: Boolean, default: false }, // Flag for soft delete
    // Other profile fields
}, { timestamps: true })

const Profile = mongoose.model('Profile', profileSchema)
export default Profile;