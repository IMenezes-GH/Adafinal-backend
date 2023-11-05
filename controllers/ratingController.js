import Rating from "../models/Rating.js";
import { isValidObjectId } from "mongoose";

export const getRating = async (req, res) => {

    const {id, game, user} = req.query;

    try {

        if (!id && !game && !user) {
            const allRatings = await Rating.find({}).lean().exec(); 
            return res.json(allRatings);
        }

        if (![id, game, user].every((objectId) => isValidObjectId(objectId))) return res.status(405).json({message: 'Id inválido'});
        
        const rating = await Rating.find({$or: [{_id: id}, {game}, {user}]}).lean().exec();
        res.json(rating);

    } catch (err){
        res.status(500).json(err.message);
    }
}

export const createRating = async(req, res) => {

    const {score, description, game, user} = req.body;
    try {
        const data= {
            score,
            description,
            game,
            user
        }

        const newRating = await Rating.create(data);
        res.json(newRating);

    } catch (err){
        res.status(500).json(err.message);
    }
}