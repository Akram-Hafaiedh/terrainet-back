import express from 'express';
import { login, signup } from '../controllers/authController.js';

const router = express.Router();

router.use('/register', signup);
router.use('/login', login)

export default router;