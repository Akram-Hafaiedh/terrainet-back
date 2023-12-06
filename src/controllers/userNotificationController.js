import Notification from '../models/Notification.js'
import User from '../models/User.js'

export const userNotificationController = {

    // Unsubscribe a user from a notification
    async unsubscribeUserFromNotification(req, res) {
        const { userId, notificationId } = req.params;
        if (!userId || !notificationId) {
            return res.status(404).json({ message: 'User or notification not found' });
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $pull: { notifications: notificationId } },
                { new: true } // Return the modified user document
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User subscribed to notification successfully' });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const message = error.message || 'An unknown error occurred when unsubscribing notitication';
            res.status(statusCode).json(message);
        }
    },

    // Subscribe a user to a notification
    async subscribeUserToNotification(req, res) {

        const { userId, notificationId } = req.params;

        if (!userId || !notificationId) {
            return res.status(404).json({ message: 'User or notification not found' });
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $push: { notifications: notificationId } },
                { new: true } // Return the modified user document
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'User subscribed to notification successfully' });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const message = error.message || 'An unknown error occurred when subscribingnotitication';
            res.status(statusCode).json(message);
        }
    },

    // get all undread notifications for a user
    async getNotificationsForUser(req, res) {
        const { userId } = req.params;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const pageNumber = parseInt(req.query.pageNumber) || 1;

        if (isNaN(pageSize) || isNaN(pageNumber) || pageSize < 1 || pageNumber < 1) {
            return res.status(400).json({ error: 'Invalid pageSize or pageNumber' });
        }
        try {
            const unreadNotifications = await Notification.find({ userId, isRead: false })
                .sort({ createdAt: -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            res.status(200).json({ notifications: unreadNotifications });
        } catch (error) {

            console.log(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || 'An unknown error occurred when retreiving notitication';
            res.status(statusCode).json(message);
        }
    }
    ,
    // Mark a notification as read for a specific user
    async markNotificationAsRead(req, res) {
        const notificationId = req.params.notificationId;

        try {
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            notification.isRead = true;
            await notification.save();
            res.status(200).json({ message: 'Notification marked as read' });
        } catch (error) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || 'An unknown error occurred marking notification as read for the user';
            res.status(statusCode).json(message);
        }
    }
    ,
    // mark all notifications as read for a user
    async markAllNotificationsAsRead(req, res) {
        const userId = req.params.userId;
        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
        
        if (!isValidObjectId) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }
        try {
            await Notification.updateMany({ userId, isRead: false }, { isRead: true });
            res.status(200).json({ message: 'All notifications marked as read for the user' });
        } catch (error) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || 'An unknown error occurred marking notifications as read for the user';
            res.status(statusCode).json(message);
        }
    },
    // mark all notitications as read for user
    // async deleteAllNotifications(req, res) {
    //     const userId = req.params.userId;
    //     const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);

    //     if (!isValidObjectId) {
    //         return res.status(400).json({ error: 'Invalid userId format' });
    //     }
    //     try {
    //         await Notification.deleteMany({ userId });
    //         res.status(200).json({ message: 'Notifications deleted successfully' });
    //     } catch (error) {
    //         console.log(error);
    //         const statusCode = error.statusCode || 500;
    //         const message = error.message || 'An unknown error occurred when deleting notifications';
    //         res.status(statusCode).json(message);
    //     }
    // }
    // ,
}
