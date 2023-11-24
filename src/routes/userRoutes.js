import express from 'express';

import { userController } from '../controllers/userController.js';
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

router.post('/multiple-users',userController.createMultipleusers)

// Routes for reservations
router.get('/:userId/reservations', userReservationController.getUserReservations)
router.get('/:userId/reservations/:reservationId', userReservationController.getUserReservationById);

export default router;