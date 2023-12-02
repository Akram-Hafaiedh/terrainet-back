import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({

    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For one-to-one messages
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },// For group messages or general chats
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;