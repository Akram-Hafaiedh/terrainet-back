import express from 'express';
import 'dotenv/config'
import mongoose from 'mongoose';
import passport from './src/config/passport.js';

import placeRouter from './src/routes/placeRoutes.js';
import profileRouter from './src/routes/profileRoutes.js';
import userRouter from './src/routes/userRoutes.js';
import authRouter from './src/routes/authRoutes.js';
import reservationRouter from './src/routes/reservationRoutes.js';
import eventRouter from './src/routes/eventRoutes.js';
import notificationRouter from './src/routes/notificationRoutes.js'


const PORT = process.env.PORT || 3001

const app = express()

// Middleware
app.use(express.json());
app.use(passport.initialize());
// Serve the "uploads" directory as a static directory
app.use('/uploads', express.static('uploads'));

// Connect to the database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to database');
        // Start the server after successfully connecting to the database
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    })
    .catch((error) => {
        console.log('Eror connecting to the database', error);
        // process.exit(1)
    });

// Hello from the app
app.get('/', (req, res) => {
    res.send('Hello world!')
})

// Routes
app.use('/users', userRouter);
app.use('/places', placeRouter);
app.use('/reservations', reservationRouter);
app.use('/profiles', profileRouter);
app.use('/events', eventRouter);
app.use('/notifications', notificationRouter);

app.use('/auth', authRouter);



