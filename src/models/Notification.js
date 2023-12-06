import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: mongoose.Schema.Types.ObjectId, red: 'NotificationType' },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    expirationDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});
// we are frequently sorting by createdAt
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ user: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;