import Location from "../models/Location.js";
import Place from "../models/Place.js";


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
            const places = await Place.find().populate('reservations');
            res.status(200).json(places);
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
            const placeId = req.params.placeId;
            const updatedPlace = await Place.findByIdAndUpdate(
                placeId,
                req.body,
                { new: true }
            )
            res.status(200).json(updatedPlace)
        } catch (error) {
            // res.status(404).json({ message: error.message });
            res.status(404).json({ message: 'Place not found' });
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

