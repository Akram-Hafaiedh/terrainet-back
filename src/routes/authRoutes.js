import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

router.use('/register', register);
router.use('/login', login)

export default router;