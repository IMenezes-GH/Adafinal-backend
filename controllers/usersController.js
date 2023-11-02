import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getUserById = async (req, res) => {

    const id = req.query.id || req.params.id;
    if (!id) return res.status(405).json({message: 'Campo id de usuário é obrigatório'});
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(405).json({message: "id de usuário inválido"})

    try {
        const user = await User.findById(id).exec();
        if (!user) return res.status(404).json({message: 'Usuário não foi encontrado.'});

        res.json(user);

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
export const createUser = async (req, res) => {
    
    const {name, email, password, birthDate, country, state, roles, active} = req.body;
    if (!name || !email || !password) return res.status(405).json({message: 'Nome, email e senha são campos obrigatórios.'});

    try {
        const duplicate = await User.findOne({email}).select('email').lean().exec();
        if (duplicate) return res.sendStatus(409); // Conflito

        const hashPwd = await bcrypt.hash(password, Number(process.env.SALT_KEY));

        const newUser = {
            name,
            email,
            password : hashPwd,
            birthDate,
            country,
            state,
            roles,
            active
        }

        await User.create(newUser);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).json(err.message);
    } 
}
export const updateUser = async (req, res) => {
    
    try {



    } catch (err) {
        res.status(500).json(err.message);
    } 
}
export const deleteUser = async (req, res) => {
    
    try {



    } catch (err) {
        res.status(500).json(err.message);
    } 
}