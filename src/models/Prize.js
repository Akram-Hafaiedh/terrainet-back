import mongoose from 'mongoose';

const prizeSchema = new mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String },
    value: { type: Number },
});

const Prize = mongoose.model('Prize', prizeSchema);
export default Prize;