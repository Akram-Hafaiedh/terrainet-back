import mongoose from 'mongoose';

const notificationTypeSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
});

const NotificationType = mongoose.model('NotificationType', notificationTypeSchema);
export default NotificationType