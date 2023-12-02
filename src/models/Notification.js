import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    timestamp: { type: Date, default: Date.now },
});

const Notificaion = mongoose.model('Notification', notificationSchema)

export default Notificaion;