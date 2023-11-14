import Rating from "../models/Rating.js";
import { isValidObjectId } from "mongoose";


/**
 * @desc Pesquisa avaliações por jogo
 * @route GET /ratings?id=param1&game=param2&user=param3&min=param4&max=param5
 * @access PUBLIC
 */
export const getRating = async (req, res) => {
    // #swagger.tags = ['Ratings']
    const {id, game, user, min, max} = req.query;
    
    try {

        if (!id && !game && !user) {
            const allRatings = await Rating.find({}).lean().exec(); 
            return res.json(allRatings);
        }

        if (![id, game, user].some((objectId) => isValidObjectId(objectId))) return res.status(405).json({message: 'Id inválido'});
        
        const rating = await Rating.find(
            {$or: [{_id: id}, {game}, {user}]})
            .skip(min).limit(max)
            .lean().exec();
        res.json(rating);

    } catch (err){
        res.status(500).json(err.message);
    }
}

/**
 * @desc Cadastra uma avaliação
 * @route POST /ratings
 * @access PRIVATE
 */
export const createRating = async(req, res) => {
    // #swagger.tags = ['Ratings']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    const {score, description, game, user} = req.body;
    console.log(req.body);
    try {
        const data= {
            score,
            description,
            game,
            user
        }

        const newRating = await Rating.create(data);
        console.log(newRating);
        res.json(newRating);

    } catch (err){
        res.status(500).json(err.message);
    }
}

/**
 * @desc Atualiza avaliação
 * @route PATCH /ratings
 * @access PRIVATE
 */
export const updateRating = async (req, res) => {
    // #swagger.tags = ['Ratings']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    const {id, description, score} = req.body;

    try {

        if (!id || !isValidObjectId(id)) return res.status(400).json({message: "Id de avaliação está faltando ou inválido."});

        const rating = await Rating.findById(id).exec();
        if (!rating) return res.status(404).json({message: "Avaliação não existe."});

        rating.description = description ?? rating.description;
        rating.score = score ?? rating.score;

        await rating.save();

        res.json(rating);

    } catch (err){
        res.status(500).json(err.message);
    }
}