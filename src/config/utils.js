import jwt from 'jsonwebtoken';
import 'dotenv/config';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;



export const sanitizeUser = (user) => {
    const { _id, password, createdAt, updatedAt, __v, ...sanitizedUser } = user.toObject();
    return { id: _id, ...sanitizedUser };
};


export const calculateEndTime = (startTime, durationInHours) => {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + durationInHours);
    return endTime;
};


export const convertToTime = (...args) => {
    if (args.length === 1) {
        // Scenario 1: Only one argument provided (e.g., '12:00')
        return new Date(`1970-01-01T${args[0]}:00.000Z`);
    } else if (args.length === 2) {
        // Scenario 2: Two arguments provided (e.g., (12, '00'))
        const [hours, minutes] = args;
        return new Date(`1970-01-01T${hours}:${minutes}:00.000Z`);
    } else if (args.length === 3) {
        // Scenario 3: Three arguments provided (e.g., (12, 0, 'PM'))
        const [hours, minutes, period] = args;
        const adjustedHours = period.toUpperCase() === 'PM' ? hours + 12 : hours;
        return new Date(`1970-01-01T${adjustedHours}:${minutes}:00.000Z`);
    } else {
        // Invalid number of arguments
        throw new Error('Invalid number of arguments for convertToTime function');
    }
};


export const generateToken = (user) => {
    const payload = {
        user: {
            id: user._id,
            email: user.email,
            username: user.username
        }
    }
    const token = jwt.sign({ payload }, JWT_SECRET_KEY, { expiresIn: '6h' });
    return token;
}