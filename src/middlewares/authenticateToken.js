import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
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

export default authenticateToken;