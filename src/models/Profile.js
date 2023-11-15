import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    // Other profile fields
}, { timestamps: true })

const Profile = mongoose.model('Profile', profileSchema)
export default Profile;