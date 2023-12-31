import express from 'express'
import { placeReservationController } from '../controllers/placeReservationController.js'
import { authenticateJWT } from '../middlewares/authenticateToken.js';

// mergeParams allows access to parent router's params
const router = express.Router({ mergeParams: true });

// NOTE - CRUD : CREATE, READ , UPDATE: PUT , DELETE


router.post('/', placeReservationController.createReservation);
router.get('/', placeReservationController.getAllReservations);
router.get('/:reservationId', placeReservationController.getReservationById);


router.put('/:reservationId', placeReservationController.updateReservationById);
router.delete('/:reservationId', placeReservationController.deleteReservationById);

export default router;