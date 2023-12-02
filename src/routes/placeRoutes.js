import express from 'express';
import { placeController, placeUserController } from '../controllers/placeController.js';
import placeReservationController from './placeReservationRoutes.js'
import { authenticateUser } from '../middlewares/authenticateToken.js';

const router = express.Router();
// Place management

router.use(authenticateUser);


router.get('/type/:type', placeController.getPlacesByType)
router.get('/types', placeController.getAllPlaceTypes);

router.post('/', placeController.createPlace);
router.get('/', placeController.getAllPlaces);
router.get('/:placeId', placeController.getPlaceById);
router.put('/:placeId', placeController.updatePlaceById);
router.delete('/:placeId', placeController.deletePlaceById);

// Include user reservation routes for a specific place
router.use('/:placeId/reservations', placeReservationController)
//! TODO
router.get('/:placeId/users-with-reservations', placeUserController.getUsersWithReservations)

router.put('/:placeId/update-location', placeController.updatePlaceLocationById)

export default router;