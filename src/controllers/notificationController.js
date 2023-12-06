import Notification from '../models/Notification.js'

export const notificationController = {
    //! TODO Autorization and access control

    //  Create a new notification. (without specifying a specific user)
    async createNotification(req, res) {
        const { type, message } = req.body

        if (!type || type.length < 3 || type.length > 50) {
            return res.status(400).json({ message: 'Invalid notification type' });
        }
        if (!message || message.length < 10 || message.length > 255) {
            return res.status(400).json({ message: 'Invalid notification message' });
        }
        try {
            const newNotification = new Notification({
                type,
                message,
            });

            await newNotification.save()
            res.status(201).json({ message: 'Notification created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    ,
    // Implement logic to group related notifications or categorize them for better organization.
    async groupNotifications(req, res) {
        const { type, groupBy } = req.query;

        if (!type) {
            return res.status(400).json({ message: 'Missing notification type' });
        }

        if (!groupBy || !['type', 'createdAt', 'read'].includes(groupBy)) {
            return res.status(400).json({ message: 'Invalid group by criteria' });
        }
        try {
            const groupedNotifications = await Notification.aggregate([
                { $match: { type } }, // Filter notifications by type
                {
                    $group: {
                        _id: `$${groupBy}`,
                        // count: { $sum: 1 }
                        notifications: { $push: '$$ROOT' },
                    }
                },
                { $sort: { _id: 1 } } // Sort grouped documents by the chosen criteria
            ])
            res.status(200).json({ groupedNotifications });
        } catch (error) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || 'An unknown error occurred when grouping notifications';
            res.status(statusCode).json(message);
        }
    },
    // Retrieve a list of all notifications globally. (across all users)
    async getNotifications(req, res) {
        try {
            const notifications = await Notification.find();
            res.status(200).json({ notifications });
        } catch (error) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || 'An unknown error occurred when retreiving notifications';
            res.status(statusCode).json(message);
        }
    }
    ,
    // Allow users to filter notifications based on criteria such as type, date, or status.
    async filterNotifications(req, res) {
        // /notifications/filter?type=someType
        // Validate the filter criteria
        const allowedFilters = {
            type: {
                required: true,
                type: String,
                minLength: 3,
                maxLength: 50,
            },
        };

        const errors = [];
        for (const filter in allowedFilters) {
            if (allowedFilters[filter].required && !req.query[filter]) {
                errors.push(`Missing required filter parameter: ${filter}`);
            } else if (req.query[filter] && typeof req.query[filter] !== allowedFilters[filter].type) {
                errors.push(`Invalid type for filter parameter: ${filter}`);
            } else if (req.query[filter] && req.query[filter].length < allowedFilters[filter].minLength || req.query[filter].length > allowedFilters[filter].maxLength) {
                errors.push(`Invalid length for filter parameter: ${filter}`);
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(', ') });
        }
        // Validate the filter criteria
        if (!type) {
            return res.status(400).json({ message: 'Missing filter criteria' });
        }
        try {
            const filteredNotifications = await Notification.find({ type });
            res.status(200).json({ notifications: filteredNotifications });
        } catch (error) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || 'An unknown error occurred when filtering notitication';
            res.status(statusCode).json(message);
        }
    }
    ,
    // Delete a notification (based on notification ID)
    // async deleteAllNotifications(req, res) {
    //     const notificationId = req.params.notificationId;
    //     try {
    //         const notification = await Notification.findByIdAndDelete(notificationId);
    //         if (!notification) {
    //             return res.status(404).json({ message: 'Notification not found' });
    //         }
    //         res.status(200).json({ message: 'Notifications deleted successfully' });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Error deleting notifications' });
    //     }
    // }
    // ,
    
    // Automatically remove notifications that have expired or are no longer relevant.
    async deleteExpiredNotifications(req, res) {
        try {
            // Delete notifications that have passed their expiration date
            const expiredNotifications = await Notification.deleteMany({ expirationDate: { $lte: new Date() } });
            if (expiredNotifications.deletedCount === 0) {
                res.status(200).json({ message: 'No expired notifications to delete.' });
            }
            res.status(200).json({ message: `${expiredNotifications.deletedCount} expired notifications deleted` });
        } catch (error) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || 'An unknown error occurred when deleting expired notifications';
            res.status(statusCode).json(message);
        }
    }
    ,
    async searchNotifications(req, res) {
        const { keyword } = req.query;
        try {
            if (!keyword) {
                return res.status(400).json({ message: 'Missing search keyword' });
            }
            const matchedNotifications = await Notification.find({
                $or: [
                    { type: { $regex: keyword, $options: 'i' } },
                    { message: { $regex: keyword, $options: 'i' } },
                ],
            });
            if (!matchedNotifications) {
                return res.status(200).json({ message: 'No matching notification found' })
            }
            res.status(200).json({ notifications: matchedNotifications });
        } catch (error) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || 'An unknown error occurred when searching notifications';
            res.status(statusCode).json(message);
        }
    }
}

