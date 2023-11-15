import express from 'express';
import { createPlace, deletePlaceById, getPlaceById, getPlaces, updatePlaceById } from '../controllers/placeController.js';

const router = express.Router();

router.post('/', createPlace);
router.get('/', getPlaces);
router.get('/:id', getPlaceById);
router.put('/:id', updatePlaceById);
router.delete('/:id', deletePlaceById);

export default router;