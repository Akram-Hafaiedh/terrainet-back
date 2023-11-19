import express from 'express'
import { reservationController } from '../controllers/reservationController.js';


const router = express.Router({ mergeParams: true });

// NOTE - CRUD : CREATE, READ , UPDATE: PUT , DELETE

router.post('/', reservationController.createReservation);
router.get('/', reservationController.getReservations);
router.get('/:id', reservationController.getReservationById);
router.put('/:id', reservationController.updateReservationById);
router.delete('/:id', reservationController.deleteReservationById);

export default router;