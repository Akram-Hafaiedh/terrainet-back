import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    adress: { type: String, required: true },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // array of numbers
            retquired: true
        }
    }
})

// Location Example
// {
//     "type": "Point",
//     "coordinates": [longitude, latitude]
// }

locationSchema.index({ coordinates: '2dsphere' });

const Location = mongoose.model('Location', locationSchema)

export default Location