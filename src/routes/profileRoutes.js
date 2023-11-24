import express from 'express';
import { profileController } from '../controllers/ProfileController.js';

const router = express.Router();

//NOTE - CRUD methods : Create, READ , UPDATE : PUT , DELETE
router.post('/', profileController.createProfile); //Create
router.get('/', profileController.getProfiles); // READ ALL 
router.get('/:ProfileId', profileController.getProfileById); // READ ONE
router.put('/:ProfileId', profileController.updateProfileById); //UPDATE
router.delete('/:ProfileId', profileController.deleteProfileById); // DELETE

export default router;