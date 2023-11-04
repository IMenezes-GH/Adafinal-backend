import { Schema, model } from "mongoose";

const schema = Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        trim: true,
    },
    active: {
        type: Schema.Types.Boolean,
        require: true,
        default: true
    }
});

const Category = model('Category', schema);
export default Category;