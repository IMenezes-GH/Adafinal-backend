import mongoose from 'mongoose';
import Game from '../models/Game.js'
import ValidationContract from '../validation/validationContract.js';

/**
 * @desc Recupera todos os jogos
 * @route GET /games/all
 * @access PUBLIC
 */
export const getAllGames = async (req, res) => {
    // #swagger.tags = ['Games']

    try {
        const games = await Game.find().lean().exec();
        res.json(games);

    } catch (err){
        res.status(500).json(err.message);
    }
}

/**
 * @desc Recupera um jogo por nome
 * @route GET /games?name=param1
 * @access PUBLIC
 */
export const getGamesByName = async (req, res) => {
    // #swagger.tags = ['Games']
    const name = req.query.name;
    if (!name) return res.redirect('/games/all');

    try {
        const games = await Game.find({name: {$regex: name}}).lean().exec();
        res.json(games);

    } catch (err) {
        res.status(500).json(err.message);
    } 

}

/**
 * @desc Recupera um jogo por ID
 * @route GET /games/:id
 * @access PUBLIC
 */
export const getGameById = async (req, res) => {
    // #swagger.tags = ['Games']

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "id de jogo inválido"})

    try {
        const game = await Game.findById(id).exec();
        if (!game) return res.status(404).json({message: 'Jogo não foi encontrado.'});
    
        res.json(game);

    } catch (err) {
        res.status(500).json(err.message);
    } 
}

/**
 * @desc Cadastra um jogo
 * @route POST /games
 * @access PRIVATE
 */
export const createGame = async (req, res) => {
    // #swagger.tags = ['Games']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    const {name, description, category, url, imageURL, videoURL} = req.body;
    if (!name || !description || !url || !imageURL) return res.status(400).json({message: 'Nome, description, url, imageURL obrigatórios'});

    try {
        const contract = new ValidationContract();
        
        //Validações de nome
        contract.hasMinLen(name, 1, 'O nome deve conter pelo menos 1 caracteres. ');
        contract.hasMaxLen(name, 255, 'O nome deve conter no máximo 255 caracteres. ');
        
        //Validações de descrição
        contract.hasMinLen(description, 3, 'A descrição deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(description, 128, 'A descrição deve conter no máximo 128 caracteres. ');


        if(!contract.isValid()){
            res.status(405).send(contract.errors()).end();
            return;
        }

        const duplicate = await Game.findOne({$or: [{url}, {name}]}).lean().exec();
        if (duplicate) return res.sendStatus(409);

        const newGame = {
            name,
            description,
            category,
            url,
            imageURL,
            videoURL
        }

        const createdGame = await Game.create(newGame);
        res.status(201).json({message: `jogo: ${createdGame._id} criado.`});

    } catch (err) {
        res.status(500).json(err.message);
    } 
}

/**
 * @desc Atualiza um jogo
 * @route PATCH /games
 * @access PRIVATE
 */
export const updateGame = async (req, res) => {
    // #swagger.tags = ['Games']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    const {id, name, description, category, url, imageURL, videoURL, active, score, ratings} = req.body;
    if (!id) return res.status(400).json({message: 'Id obrigatórios'});

    try {
        const contract = new ValidationContract();
        const game = await Game.findById(id).exec();
        
        //Validações de nome
        if (name){
            contract.hasMinLen(name, 3, 'O nome deve conter pelo menos 3 caracteres. ');
            contract.hasMaxLen(name, 255, 'O nome deve conter no máximo 255 caracteres. ');
        }
        
        //Validações de descrição
        if (description){
            contract.hasMinLen(description, 3, 'A descrição deve conter pelo menos 3 caracteres. ');
            contract.hasMaxLen(description, 128, 'A descrição deve conter no máximo 128 caracteres. ');
        }


        if(!contract.isValid()){
            res.status(405).send(contract.errors()).end();
            return;
        }

        game.name = name || game.name;
        game.description = description || game.description;
        game.category = category || game.category;
        game.url = url || game.url;
        game.imageURL = imageURL || game.imageURL;
        game.videoURL = videoURL || game.videoURL;
        game.active = active || game.active;
        game.score = score || game.score;
        game.ratings = ratings || game.ratings;
    

        const updatedGame = await game.save();
        res.json({message: `jogo: ${updatedGame._id} Atualizado.`});

    } catch (err) {
        res.status(500).json(err.message);
    } 
}

/**
 * @desc Exclui um jogo
 * @route DELETE /games
 * @access PRIVATE
 */
export const deleteGame = async (req, res) => {
    // #swagger.tags = ['Games']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    const {id} = req.body;
    if (!id) return res.status(400).json({message: 'Id é obrigatório'});

    try {
        const game = await Game.findById(id).exec();
        if (!game) return res.sendStatus(404);

        const deletedGame = await game.deleteOne();
        return res.json({message: `Jogo ${deletedGame.name} deletado`})

    } catch (err) {
        res.status(500).json(err.message);
    } 
}