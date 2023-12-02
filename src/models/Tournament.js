import mongoose from "mongoose";

const tournamentSchema = mongoose.Schema({

    name: { type: String, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],

});

const Tournament = mongoose.model('Tournament', tournamentSchema);
export default Tournament