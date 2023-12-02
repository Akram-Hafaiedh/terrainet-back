import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({

    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    date: { type: Date, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    outcome: { type: String },
});

const Match = mongoose.model('Match', matchSchema);

export default Match;