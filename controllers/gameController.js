import mongoose from 'mongoose';
import Game from '../models/Game.js'
import bcrypt from 'bcrypt';
import ValidationContract from '../validation/validationContract.js';
import { json } from 'express';

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getGameById = async (req, res) => {

    const id = req.query.id || req.params.id;
    if (!id) return res.status(405).json({message: 'Campo id é obrigatório'});
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(405).json({message: "id inválido"})

    try {
        const game = await Game.findById(id).exec();
        if (!game) return res.status(404).json({message: 'Jogo não foi encontrado.'});

        res.json(game);

    } catch (err) {
        res.status(500).json(err.message);
    } 
}

/**
 * Cria um usuário
 * @param {Request} req Objeto Request do Express
 * @param {Response} res Objeto Response do Express
 * @returns {Response} resposta do request realizado
 */
export const createGame = async (req, res) => {
    
    const {name, description, category, url, imageURL, videoURL} = req.body;
    if (!name || !description || !url || !imageURL) return res.status(405).json({message: 'Nome, description, url, imageURL obrigatórios'});

    try {
        const contract = new ValidationContract();
        
        //Validações de nome
        contract.isRequired(name, 'O nome é obrigatório. ');
        contract.hasMinLen(name, 3, 'O nome deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(name, 255, 'O nome deve conter no máximo 255 caracteres. ');
        
        //Validações de descrição
        contract.isRequired(description, 'O e-mail é obrigatório. ');
        contract.hasMinLen(description, 3, 'A descrição deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(description, 128, 'A descrição deve conter no máximo 128 caracteres. ');


        if(!contract.isValid()){
            res.status(405).send(contract.errors()).end();
            return;
        }

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
export const updateGame = async (req, res) => {

    const {id, name, description, category, url, imageURL, videoURL, active, score, ratings} = req.body;
    if (!id) return res.status(405).json({message: 'Id obrigatórios'});

    try {
        const contract = new ValidationContract();
        const game = await Game.findById(id).exec();
        
        //Validações de nome
        contract.isRequired(name, 'O nome é obrigatório. ');
        contract.hasMinLen(name, 3, 'O nome deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(name, 255, 'O nome deve conter no máximo 255 caracteres. ');
        
        //Validações de descrição
        contract.isRequired(email, 'O e-mail é obrigatório. ');
        contract.hasMinLen(email, 3, 'A descrição deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(email, 128, 'A descrição deve conter no máximo 128 caracteres. ');


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
        res.status(201).json({message: `jogo: ${updatedGame._id} Atualizado.`});

    } catch (err) {
        res.status(500).json(err.message);
    } 
}
export const deleteGame = async (req, res) => {
    
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