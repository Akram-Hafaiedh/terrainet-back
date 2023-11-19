import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router()

router.use(authenticateToken);

// Example usage for a protected web route
router.get('/dashboard', (req, res) => {
    // Access is granted, respond with protected data
    res.json({ message: 'This is protected dashboard ' });
});

export default router;