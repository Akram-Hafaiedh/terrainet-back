import express from 'express';
import { createUser, deleteUserById, getUserById, getUserReservationById, getUserReservations, getUsers, updateUserById } from "../controllers/userController.js";
import { checkUserRole } from '../middlewares/auth.js';

const router = express.Router();

// Routes for user management
router.post('/', checkUserRole(['admin']), createUser);
router.get('/', checkUserRole(['admin']), getUsers);
router.get('/:id', checkUserRole(['admin']), getUserById);
router.put('/:id', checkUserRole(['admin']), updateUserById);
router.delete('/:id', checkUserRole(['admin']), deleteUserById);

// Routes for reservations
router.get('/:userId/reservations', getUserReservations)
router.get('/:userId/reservations/:reservationId', getUserReservationById);

export default router;