import express from 'express'
import { createReservation, deleteReservationById, getReservationById, getReservations, updateReservationById } from '../controllers/reservationController.js';

const router = express.Router({ mergeParams: true });

// NOTE - CRUD : CREATE, READ , UPDATE: PUT , DELETE

router.post('/', createReservation);
router.get('/', getReservations);
router.get('/:id', getReservationById);
router.put('/:id', updateReservationById);
router.delete('/:id', deleteReservationById);

export default router;