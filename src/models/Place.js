import mongoose from 'mongoose';


const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },

    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    // location: {
    //     laptitude: { type: Number, required: true },
    //     longitude: { type: Number, required: true },
    // },
    photos: [{ type: String }],
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
    rating: { type: Number }

    // oteher fields
}, { timestamps: true })

const Place = mongoose.model('Place', placeSchema);
export default Place