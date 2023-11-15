
import { calculateEndTime } from '../config/utils.js';
import { Place, Reservation } from '../models/Place.js'
import User from '../models/User.js';

// create a reservations
export const createReservation = async (req, res) => {
    try {
        const { userId, placeId, date, startTime } = req.body;

        //calculate the endTime (one hour later than startTIme)
        const endTime = calculateEndTime(startTime, 1); //Assuming duration is 1 hour


        const existingReservation = await Reservation.findOne({
            placeId,
            date,
            $or: [
                { startTime: { $gte: startTime, $lte: endTime } },
                { endTime: { $gte: startTime, $lte: endTime } },
            ],
        });
        if (existingReservation) {
            // If there is a conflict, respond with a 409 Conflict status
            //NOTE - 409 : Conflict
            return res.status(409).json({ message: 'Conflict : Another reservation exist for the given time and day' });
        }

        const newReservation = new Reservation({
            userId,
            placeId,
            date,
            startTime,
            endTime,
        })
        // save the new reservation
        await newReservation.save();

        // update the user's reservation array
        await User.findOneAndUpdate(
            { _id: userId },
            { $push: { reservations: newReservation._id } },
            { new: true } // return the updated user document
        );

        // NOTE - 201 : Created
        res.status(201).json(newReservation);
    } catch (error) {
        console.error('Error creating reservation:', error);
        //NOTE - 400: Bad Request
        res.status(400).json({ message: error.message })
    }
}
// get all reservations
export const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        // NOTE - 200: OK
        res.status(200).json(reservations);
    } catch (error) {
        // NOTE - 500 : Internal Server Error
        res.status().json({ message: error.message });
    }
}
// get one reservation by Id
export const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
        // NOTE - 200: OK
        res.status(200).json(reservation)
    } catch (error) {
        // NOTE - 404 : Not found
        res.status(404).json({ message: 'Reservation not found' });
        // res.status().json({message:error.message});
    }
}
// update a reservation by id
export const updateReservationById = async (req, res) => {
    // console.log(req.body);
    try {
        const reservationId = req.params.id
        // console.log("🚀 ~ file: reservationController.js:82 ~ updateReservationById ~ req.params:", req.params)
        // console.log("🚀 ~ file: reservationController.js:82 ~ updateReservationById ~ reservationId:", reservationId)
        const { date, placeId, startTime, userId } = req.body

        // Calculate the endTime based on the new startTime (assuming duration is 1 hour)
        const endTime = calculateEndTime(startTime, 1);

        // check for conflicts with existing reservations
        const existingReservation = await Reservation.findOne({
            _id: { $ne: reservationId }, // Exclude the current reservation
            placeId,
            date,
            $or: [
                { startTime: { $gte: startTime, $lte: endTime } },
                { endTime: { $gte: startTime, $lte: endTime } },
            ],
        });
        if (existingReservation) {
            //NOTE - 409 : Conflict
            return res.status(409).json({ message: 'Conflict : Another reservation exist for the given time and day' });
        }


        // Update the reservation
        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            { startTime, endTime },
            { new: true } // Return the updated document
        );
        console.log("🚀 ~ file: reservationController.js:109 ~ updateReservationById ~ updatedReservation:", updatedReservation)

        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation not found', details: 'Reservation ID not found' });
        }

        await User.findByIdAndUpdate(
            userId,
            {
                $pull: { reservations: reservationId }, // Remove the old reservation
                // $push: { reservations: updatedReservation }, // Add the updated reservation
            },
            { new: true }
        );
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                // $pull: { reservations: reservationId }, // Remove the old reservation
                $push: { reservations: updatedReservation }, // Add the updated reservation
            },
            { new: true }
        );
        console.log("🚀 ~ file: reservationController.js:124 ~ updateReservationById ~ updatedUser:", updatedUser)

        // NOTE - 200 : OK
        res.status(200).json(updatedReservation);
    } catch (error) {
        // NOTE - 404 : Not found
        res.status(404).json({ message: 'Reservation not found', details: 'Unknown error' });
        console.log(error);
    }
}
// delete a reservation by id
export const deleteReservationById = async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        // NOTE - 204 : Request Ended
        res.status(204).end()
    } catch (error) {
        // NOTE - 404 : Not Found
        res.status(404).json({ message: 'Reservation not found' });
        // res.status().json({message:error.message});
    }
}


