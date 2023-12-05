import jwt from 'jsonwebtoken';
import 'dotenv/config';
import passport from 'passport';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized : Missing token' })
    }
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized: Token has expired' });
            }
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Access is granted, respond with protected data
        // Token is valid, proceed to the next middleware or route handler
        req.user = decoded.user; // Attach user information to the request
        // return done(null, decoded.user);
        next();
    });
}

export const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        return next();
    })(req, res, next);
}
// Middleware to authenticate users for protected routes
export const authenticateUser = (req, res, next) => {
    // Check for JWT token
    const token = req.headers.authorization?.split(' ')[1];
    // console.log('Received Token:', token);

    if (token) {
        // JWT authentication
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log('Token verification Error:', err);
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Unauthorized: Token has expired' });
                }
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            // Access is granted, respond with protected data
            req.user = decoded.user; // Attach user information to the request
            next();
        });
    } else {
        // Check for third-party authentication (e.g., Google, Facebook)
        passport.authenticate(['local', 'google', 'facebook'], { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (user) {
                // Authentication successful
                req.user = user; // Attach user information to the request
                next();
            } else {
                // No valid authentication method found
                return res.status(401).json({ message: 'Unauthorized: No valid authentication method' });
            }
        })(req, res, next);
    }
};


export default authenticateToken;