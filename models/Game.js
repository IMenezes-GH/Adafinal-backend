import { Schema, model } from "mongoose";

const schema = Schema({

    name: {
        type: Schema.Types.String,
        required: [true, 'O nome é obrigatório. '],
        trim: true,
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    description: {
        type: Schema.Types.String,
        required: true,
        trim: true
    },

    url:{
        type: Schema.Types.String,
        required: true,
        trim: true
    },

    imageURL: {
        type: Schema.Types.String,
        required: true,
        trim: true,
    },

    videoURL: {
        type: Schema.Types.String,
        required: false,
        trim: true,
    },

    ratings: [{
        type: Schema.Types.ObjectId,
        ref: "Rating"
    }],

    score :{
        type: Number,
        default: 0
    },

    active: {
        type: Boolean,
        require: true,
        default: true
    }
});

const Game = model('Game', schema);
export default Game;