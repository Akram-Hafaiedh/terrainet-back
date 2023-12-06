import express from 'express';
import { notificationController } from '../controllers/notificationController.js'

const router = express.Router()

// Create a notification
router.post('/', notificationController.createNotification);

// Retrieve a list of all notifications globally.
router.get('/', notificationController.getNotifications);

// Create route for grouping notifications
router.get('/group', notificationController.groupNotifications);

//Filter a notification
router.get('/filter', notificationController.filterNotifications);

// Create route for search
router.get('/search', notificationController.searchNotifications);

// Delete expired notifications
router.delete('/expired', notificationController.deleteExpiredNotifications);


// Delete a notification
// router.delete('/:notificationId', notificationController.deleteAllNotifications);

export default router;