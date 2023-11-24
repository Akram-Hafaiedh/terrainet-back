import express from 'express'
import { reservationController } from '../controllers/reservationController.js';


// mergeParams allows access to parent router's params
const router = express.Router({ mergeParams: true });

// NOTE - CRUD : CREATE, READ , UPDATE: PUT , DELETE

router.post('/', reservationController.createReservation);
router.get('/', reservationController.getAllReservations);
router.get('/:reservationId', reservationController.getReservationById);
router.put('/:reservationId', reservationController.updateReservationById);
router.delete('/:reservationId', reservationController.deleteReservationById);

// New route for creating multiple reservations
router.post('/create-multiple', reservationController.createMultipleReservations);

export default router;