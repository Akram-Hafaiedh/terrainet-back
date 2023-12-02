import express from 'express';

import { userController, userEventController, userPlaceController } from '../controllers/userController.js';
import { userReservationController } from '../controllers/userController.js';
import { checkUserRole } from '../middlewares/auth.js';

const router = express.Router();

//! ADD MIDDLEWARE FOR MANAGEMENT

// Routes for user management
router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUserById);
router.delete('/:userId', userController.deleteUserById);

router.post('/multiple-users', userController.createMultipleusers);

//! TODO
router.put('/:userId/changePassword', userController.changeUserPassword);


//Routes for profiles
router.get('/:userId/profile', userController.getUserProfile);
router.put('/:userId/profile', userController.updateUserProfile);
router.delete('/:userId/profile', userController.deleteUserProfile);


// Routes for reservations
router.get('/:userId/reservations', userReservationController.getUserReservations);
router.get('/:userId/reservations/:reservationId', userReservationController.getUserReservationById);

//! TODO
router.post('/:userId/favorites/:placeId', userPlaceController.addUserFavoritePlace)
router.get('/:userId/favorites', userPlaceController.getUserfavoritePlaces);
router.delete('/:userId/favorites/:placeId', userPlaceController.deleteUserFavorite)

// Routes for events
router.get('/:userId/events/:eventsId/participate', userEventController.participateToEvent)


export default router;