import { Place, Reservation } from "../models/Place.js";

// Create a new Place
export const createPlace = async (req, res) => {
    try {
        const newPlace = new Place(req.body);
        await newPlace.save();
        res.status(201).json(newPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
// Get all places
export const getPlaces = async (req, res) => {
    try {
        const places = await Place.find();
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// get a place by ID
export const getPlaceById = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        res.status(200).json(place);
    } catch (error) {
        // res.status(404).json({ message: error.message });
        res.status(404).json({ message: 'Place not found' });
    }
}
// update a place by ID
export const updatePlaceById = async (req, res) => {
    try {
        const updatedPlace = await Place.findByIdAndUpdate()
        res.status(200).json(updatedPlace)
    } catch (error) {
        // res.status(404).json({ message: error.message });
        res.status(404).json({ message: 'Place not found' });
    }
}
// delete a place by ID

export const deletePlaceById = async (req, res) => {
    try {
        await Place.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        // res.status(404).json({ message: error.message });
        res.status(404).json({ message: 'Place not found' });
    }
}