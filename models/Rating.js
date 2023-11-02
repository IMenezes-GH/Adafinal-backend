import { Schema, model } from "mongoose";

const schema = Schema({

    score: {
        type: Schema.Types.Number,
        required: [true, 'A nota é obrigatória. '],
        trim: true,
    },

    description: {
        type: Schema.Types.String,
        trim: true
    },

    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

});

const Rating = model('Rating', schema);
export default Rating;