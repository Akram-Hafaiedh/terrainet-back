import express from 'express';
import { createProfile, deleteProfileById, getProfileById, getProfiles, updateProfileById } from '../controllers/ProfileController.js';

const router = express.Router();

//NOTE - CRUD methods : Create, READ , UPDATE : PUT , DELETE
router.post('/', createProfile); //Create
router.get('/', getProfiles); // READ ALL 
router.get('/:id', getProfileById); // READ ONE
router.put('/:id', updateProfileById); //UPDATE
router.delete('/:id', deleteProfileById); // DELETE

export default router;