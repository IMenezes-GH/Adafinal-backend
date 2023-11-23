import { model, Schema } from "mongoose";

const newsSchema = new Schema({
    title: {
        type: Schema.Types.String,
        required: [true, 'Título é obrigatório'],
    },
    postDate: {
        type: Date,
        required: [true, 'Data de criação é obrigatória']
    },
    body: {
        type: Schema.Types.String,
        required: 'Data de criação é obrigatória'
    },
    image: {
        type: Schema.Types.String,
    }
})

const News = new model('New', newsSchema);
export default News;