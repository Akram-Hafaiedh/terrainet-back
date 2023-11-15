import express from 'express';
import { createUser, deleteUserById, getUserById, getUserReservationById, getUserReservations, getUsers, updateUserById } from "../controllers/userController.js";
import { checkUserRole } from '../middlewares/checkRole.js';

const router = express.Router();

router.post('/', checkUserRole(['admin']), createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

router.get('/:userId/reservations', getUserReservations)
router.get('/:userId/reservations/:reservationId', getUserReservationById);

export default router;