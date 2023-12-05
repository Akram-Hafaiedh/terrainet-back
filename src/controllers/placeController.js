import Location from "../models/Location.js";
import Place from "../models/Place.js";

export const sanitizePlace = (place) => {
    const { _id, createdAt, updatedAt, __v, ...sanitizedPlace } = place.toObject();
    return { id: _id, ...sanitizedPlace };
};
export const sanitizeLocation = (location) => {
    const { _id, createdAt, updatedAt, __v, ...sanitizedLocation } = location.toObject();
    return { id: _id, ...sanitizedLocation };
};

export const placeController = {
    // Create a new Place
    async createPlace(req, res) {
        try {
            const { longitude, laptitude } = req.body.location;
            if (!req.body.location) {
                return res.status(400).json({ message: 'missing location data' });
            } else if (!laptitude || !longitude) {
                return res.status(400).json({ message: 'Invalid location data' });
            }
            const existingPlace = await Place.findOne({ name: req.body.name });
            if (existingPlace) {
                return res.status(400).json({ message: 'Place with the same name already exists' });
            }
            const existingLocation = await Location.findOne({ coordinates: [longitude, laptitude] })
            if (existingLocation) {
                return res.status(400).json({ message: 'Place with the same location already exists' });
            }
            console.log("🚀 ~ file: placeController.js:7 ~ createPlace ~ longitude, laptitude:", longitude, laptitude)
            let newPlace = new Place(req.body);
            const newLocation = new Location({
                type: 'Point',
                coordinates: [longitude, laptitude]
            })
            await newLocation.save();
            newPlace.location = newLocation._id;
            const modifiedPlace = await newPlace.save();
            res.status(201).json(modifiedPlace);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    // Get all places
    async getAllPlaces(req, res) {
        try {
            const places = await Place.find().
                populate('reservations').
                populate({ path: 'location', select: '-__v ' });
            // populate({ path: 'location', select: '-__v -_id' });
            // console.log('Before:', places);
            const sanitizedPlaces = places.map(place => sanitizePlace(place))
            // console.log('After:', sanitizedPlaces);
            res.status(200).json(sanitizedPlaces);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // get a place by ID
    async getPlaceById(req, res) {
        try {
            const placeId = req.params.placeId;
            const place = await Place.findById(placeId);
            if (!place) {
                req.status(404).json({ message: 'Place not found' });
            }

            res.status(200).json(place);
        } catch (error) {
            // res.status(404).json({ message: error.message });
            res.status(404).json({ message: 'Place not found' });
        }
    },
    // update a place by ID
    async updatePlaceById(req, res) {
        try {
            console.log('updatePlaceById');
            const placeId = req.params.placeId;
            const updatedFields = req.body;
            console.log("🚀 ~ file: placeController.js:82 ~ updatePlaceById ~ updatedFields:", updatedFields)
            // Update non-location fields
            const updatedPlace = await Place.findByIdAndUpdate(
                placeId,
                { $set: updatedFields },
                { new: true }
            )
            console.log("🚀 ~ file: placeController.js:84 ~ updatePlaceById ~ updatedPlace:", updatedPlace)
            res.status(200).json(updatedPlace)
        } catch (error) {
            // res.status(404).json({ message: error.message });
            res.status(404).json({ message: 'Place not found' });
        }
    },
    async updatePlaceLocationById(req, res) {
        try {
            const placeId = req.params.placeId;
            // const newLocationId = req.body.location
            const newLocationData = req.body.location;

            // Check if the new location data is provided
            if (!newLocationData || !newLocationData.coordinates) {
                // NOTE - 400 : Bad request
                return res.status(400).json({ message: 'Missing location data in the request body' });
            }
            // check if the location exists
            const { coordinates } = newLocationData;
            let newLocation = await Location.findOne({ "coordinates": { $eq: coordinates } });
            if (!newLocation) {
                // If the location doesn't exist, you may choose to create it
                // or return an error message, depending on your requirements.

                newLocation = await Location.create({ coordinates });
                // // NOTE - 404 : Not found
                // return res.status(404).json({ message: 'New location not found' });
            }
            // check if the location is associated with another place
            const placeWithNewLocation = await Place.findOne({ location: newLocation });
            if (placeWithNewLocation && placeWithNewLocation._id.toString() !== placeId) {
                // NOTE - 409 : Conflict
                return res.status(409).json({ message: 'Location already used by another place' });
            }
            // Update only the location field
            const updatedPlace = await Place.findByIdAndUpdate(
                placeId,
                { $set: { location: newLocation._id } },
                { new: true }
            );
            // NOTE  - 200 : OK
            res.status(200).json(updatedPlace)
        } catch (error) {
            // NOTE - 500 : Not found
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    // delete a place by ID
    async deletePlaceById(req, res) {
        try {
            await Place.findByIdAndDelete(req.params.placeId);
            res.status(204).end();
        } catch (error) {
            // res.status(404).json({ message: error.message });
            res.status(404).json({ message: 'Place not found' });
        }
    },
    // get places by Type
    async getPlacesByType(req, res) {
        try {
            const type = req.params.type.toLowerCase();
            // console.log("🚀 ~ file: placeController.js:80 ~ getPlacesByType ~ type:", type)
            // Perform a database query to get the places of the detailed type
            // const lowerType = type.lowercase()
            const places = await Place.find(
                { type },
                null, // Projection (optional)
                { collation: { locale: 'en', strength: 2 } }, // Collation for case-insensitive matching
            );
            // console.log("🚀 ~ file: placeController.js:83 ~ getPlacesByType ~ places:", places)
            // Return the places in the response
            res.status(200).json(places);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    // get all the place types
    async getAllPlaceTypes(req, res) {
        try {
            const typesWithCount = await Place.aggregate([

                { $group: { _id: '$type', count: { $sum: 1 } } },
                //or removing existing fields. For each input document, outputs one document
                // Reshapes each document in the stream, such as by adding new fields 
                { $project: { _id: 0, type: '$_id', count: 1 } },
            ])
            res.status(200).json(typesWithCount);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal Server error' })
        }
    }
}


//! TODO
export const placeUserController = {
    async getUsersWithReservations(req, res) {
        console.log('get users with reservations');
    }

}
