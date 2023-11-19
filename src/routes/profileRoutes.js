import express from 'express';
import { profileController } from '../controllers/ProfileController.js';

const router = express.Router();

//NOTE - CRUD methods : Create, READ , UPDATE : PUT , DELETE
router.post('/', profileController.createProfile); //Create
router.get('/', profileController.getProfiles); // READ ALL 
router.get('/:id', profileController.getProfileById); // READ ONE
router.put('/:id', profileController.updateProfileById); //UPDATE
router.delete('/:id', profileController.deleteProfileById); // DELETE

export default router;