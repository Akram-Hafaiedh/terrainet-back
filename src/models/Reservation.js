import mongoose from "mongoose";
import Place from "./Place.js";

const reservationSchema = new mongoose.Schema({
    // _id: { type: Schema.Types.ObjectId },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
}, { timestamps: true })

reservationSchema.pre('save', async function (next) {
    try {
        const reservation = this;
        // Update the Place model with the new reservation ID
        const updatedPlace = await Place.findByIdAndUpdate(
            reservation.placeId,
            { $push: { reservations: reservation._id } },
            { new: true },

        );
        // You might want to handle other logic here if needed

        next(); // Continue with the reservation save
    } catch (error) {
        next(error); // Pass any error to the next middleware
    }

});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation