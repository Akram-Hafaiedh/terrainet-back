import express from 'express';
import multer from 'multer';

import { userController, userEventController, userPlaceController, userProfileController } from '../controllers/userController.js';
import { userReservationController } from '../controllers/userController.js';
import { checkUserRole } from '../middlewares/auth.js';
import { userNotificationController } from '../controllers/userNotificationController.js';

const router = express.Router();
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const { userId } = req.params;
        const filename = `${userId}-${file.originalname}`;
        cb(null, filename);
    },
});


const upload = multer({ storage });
//! ADD MIDDLEWARE FOR MANAGEMENT

//SECTION Routes related to to notifcations:
router.get('/:userId/notifications', userNotificationController.getNotificationsForUser);
router.put('/:userId/notifications/mark-all-read', userNotificationController.markNotificationAsReadForUser);
router.put('/:userId/notifications/:notificationId/mark-read', userNotificationController.markNotificationAsReadForUser);
router.put('/:userId/notifications/:notificationId/unsubscribe', userNotificationController.unsubscribeUserFromNotification);
router.put('/:userId/notifications/:notificationId/subscribe', userNotificationController.subscribeUserToNotification);
// router.put('/:userId/notifications/unsubscribe/:notificationType', userNotificationController.unsubscribeUserFromNotification);
// router.put('/:userId/notifications/subscribe/:notificationType', userNotificationController.subscribeUserToNotification);

//SECTION Routes for users:
router.post('/', userController.createUser);
router.post('/multiple-users', userController.createMultipleusers);
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUserById);
router.delete('/:userId', userController.deleteUserById);


//! TODO
router.put('/:userId/changePassword', userController.changeUserPassword);


//Routes for profiles
router.get('/:userId/profile', userProfileController.getUserProfile);
router.put('/:userId/profile', userProfileController.updateUserProfile);
router.put('/:userId/profile/cover-photo', upload.single('coverPhoto'), userProfileController.updateCoverPhoto);
router.put('/:userId/profile/profile-picture', upload.single('profilePictureUrl'), userProfileController.updateProfilePicture);
// router.put('/:userId/profile/cover-photo', upload.single('profilePictureUrl'), userProfileController.updateProfilePhoto);
router.delete('/:userId/profile', userProfileController.deleteUserProfile);


// Routes for reservations
router.get('/:userId/reservations', userReservationController.getUserReservations);
router.get('/:userId/reservations/:reservationId', userReservationController.getUserReservationById);

//! TODO
router.post('/:userId/favorites/:placeId', userPlaceController.addUserFavoritePlace)
router.get('/:userId/favorites', userPlaceController.getUserfavoritePlaces);
router.delete('/:userId/favorites/:placeId', userPlaceController.deleteUserFavorite)

// Routes for events
router.get('/:userId/events/:eventsId/participate', userEventController.participateToEvent)

export default router;