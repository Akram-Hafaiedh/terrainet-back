import mongoose from 'mongoose';


const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },

    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    // location: {
    //     laptitude: { type: Number, required: true },
    //     longitude: { type: Number, required: true },
    // },
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]

    // oteher fields
}, { timestamps: true })

const Place = mongoose.model('Place', placeSchema);
export default Place