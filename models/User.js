import { Schema, model } from "mongoose";

const userSchema = Schema({

    name: {
        type: Schema.Types.String,
        required: [true, 'O nome é obrigatório. '],
        trim: true,
    },

    username: {
        type: Schema.Types.String,
        required: [true, 'O nome de usuário é obrigatório. '],
        trim: true,
    },

    email: {
        type: Schema.Types.String,
        required: [true, 'O e-mail é obrigatório. '],
        unique: true,
        trim: true
    },

    password: {
        type: Schema.Types.String,
        required: [true, 'A senha é obrigatória. ']
    },

    birthDate: {
        type: Date,
        required: [true, 'A data de nascimento é obrigatória. ']
    },

    country: {
        type: Schema.Types.String,
        required: false,
        trim: true,
    },

    state: {
        type: Schema.Types.String,
        required: false,
        trim: true,
    },

    roles: {
        type: Schema.Types.String,
        required: true,
        enum: ['member', 'admin'],
        default: 'member'
    },

    active: {
        type: Schema.Types.Boolean,
        require: true,
        default: true
    },
    
    refreshToken: {
        type: Schema.Types.String

    }
});

const User = model('User', userSchema);
export default User;