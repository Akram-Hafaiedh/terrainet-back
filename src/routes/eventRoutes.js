import express from 'express';
import { eventController, eventReservationController } from '../controllers/eventController.js';


const router = express.Router({ mergeParams: true });

router.get('/', eventController.getAllEvents);
router.post('/', eventController.createEvent);
router.get('/:eventId', eventController.getEventById);
router.put('/:eventId', eventController.updateEventById);
router.delete('/:eventId', eventController.deleteEventById);

// !TOOD
router.get('/:eventId/reservations', eventReservationController.getEventReservations);

export default router;