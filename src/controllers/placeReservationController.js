import { calculateEndTime } from "../config/utils.js";
import Place from "../models/Place.js";
import Reservation from "../models/Reservation.js";
import User from "../models/User.js";

export const placeReservationController = {
    async getAllReservations(req, res) {
        const placeId = req.params.placeId;
        try {
            const existingPlace = await Place.findById(placeId).populate('reservations');
            console.log("🚀 ~ file: placeReservationController.js:8 ~ getAllReservations: ~ existingPlace:", existingPlace)
            if (!existingPlace) {
                return res.status(404).json({ message: 'Place not found' });
            }
            // NOTE - 200 : Ok
            res.status(200).json(existingPlace.reservations);

        } catch (error) {
            // NOTE - 500 : Internal server error
            res.status(500).json({ message: 'Internal server error' });
            // console.log(error);
        }
    },
    async createReservation(req, res) {
        console.log('Reservation controlller');
        try {
            const placeId = req.params.placeId;
            const { userId, date, startTime } = req.body;
            const endTime = calculateEndTime(startTime, 1);
            const existingReservation = await Reservation.findOne({
                placeId,
                date,
                $or: [
                    { startTime: { $gte: startTime, $lte: endTime } },
                    { endTime: { $gte: startTime, $lte: endTime } },
                ]
            })
            if (existingReservation) {
                // NOTE - 409 : Conflict
                return res.status(409).json({ message: 'Conflict: Another reservation exists for the given time and day' });
            }
            const newReservation = new Reservation({
                userId,
                placeId,
                date,
                startTime,
                endTime,
            });
            await newReservation.save();
            await User.findByIdAndUpdate(
                { _id: userId },
                { $push: { reservations: newReservation._id } },
                { new: true },
            );
            await Place.findByIdAndUpdate(
                { _id: placeId },
                { $push: { reservations: newReservation } },
                { new: true },
            );
            res.status(201).json(newReservation);
        } catch (error) {
            console.log('Error creating Reservation: ', error);
            res.status(400).json({ message: error.message })
        }
    },
    async getReservationById(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.reservationId)
            if (!reservation) {
                return res.status(404).json({ message: 'Reservation not found' });
            }
            res.status(200).json(reservation)
        } catch (error) {
            console.log('Error retrieving reservation by ID: ', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    async updateReservationById(req, res) {
        try {
            const { reservationId, placeId } = req.params;
            const { date, startTime, userId } = req.body;

            // Validate startTime format using Date object
            const parsedStartTime = new Date(startTime);
            if (isNaN(parsedStartTime.getTime())) {
                return res.status(400).json({ message: 'Invalid date format for startTime.' });
            }


            // Calculate the endTime based on the new startTime (assuming duration is 1 hour)
            const endTime = calculateEndTime(startTime, 1);
            // Check for conflicts with existing reservations
            const existingReservation = await Reservation.findOne({
                _id: { $ne: reservationId }, // Exclude the current reservation
                placeId,
                date,
                $or: [
                    { startTime: { $gte: startTime, $lte: endTime } },
                    { endTime: { $gte: startTime, $lte: endTime } },
                ]
            });
            if (existingReservation) {
                // NOTE - 409 : Conflict
                return res.status(409).json({ message: 'Conflict: Another reservation exists for the given time and day' });
            }

            // Update the reservation
            const updatedReservation = await Reservation.findByIdAndUpdate(
                reservationId,
                { startTime, endTime },
                { new: true },
            )
            // update the user's reservation with the updated reservation document
            await User.findByIdAndUpdate(
                userId,
                {
                    $pull: { reservations: reservationId },
                    // $push: { reservations: updatedReservation._id },
                },
                { new: true }
            );
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    // $pull: { reservations: reservationId },
                    $push: { reservations: updatedReservation._id },
                },
                { new: true }
            );
            // Update the place's reservation with the updated reservation document
            await Place.findByIdAndUpdate(
                placeId,
                {
                    $pull: { reservations: reservationId },
                    // $addToSet: { reservations: updatedReservation },
                },
                { new: true }
            );
            await Place.findByIdAndUpdate(
                placeId,
                {
                    // $pull: { reservations: reservationId },
                    $push: { reservations: updatedReservation },
                },
                { new: true }
            );

            res.status(200).json(updatedReservation);
        } catch (error) {
            console.error('Error updating reservation by ID:', error);
            res.status(404).json({ message: 'Reservation not found', details: 'Unknown error' });
        }
    },
    async deleteReservationById(req, res) {
        try {
            const reservationId = req.params.reservationId;
            const deletedReservation = await Reservation.findByIdAndDelete(reservationId);
            if (!deletedReservation) {
                // NOTE - 404 Not found
                return res.status(404).json({ message: 'Reservation not found' });
            }
            // Remove the reservation from the user's reservations
            await User.findByIdAndUpdate(
                deletedReservation.userId,
                { $pull: { reservations: reservationId } }
            );

            // Remove the reservation from the place's reservations
            await Place.findByIdAndUpdate(
                deletedReservation.placeId,
                { $pull: { reservations: reservationId } }
            );
            // Respond with a status of 204 (No Content) to indicate successful deletion
            // NOTE - 204 : No content
            res.status(204).end()
        } catch (error) {

        }
    }
}

