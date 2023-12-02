import mongosoe from 'mongoose';


const categorySchema = new mongosoe.Schema({

    name: { type: String, unique: true, required: true },
    description: { type: String },
});

const Category = mongosoe.model('Category', categorySchema);

export default Category;