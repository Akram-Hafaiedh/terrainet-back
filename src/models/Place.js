import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    // _id: { type: Schema.Types.ObjectId },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
}, { timestamps: true })

const Reservation = mongoose.model('Reservation', reservationSchema);

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: {
        laptitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    resrvations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]

    // oteher fields
}, { timestamps: true })

const Place = mongoose.model('Place', placeSchema);
export { Place, Reservation };