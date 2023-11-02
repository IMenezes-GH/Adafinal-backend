import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import ValidationContract from '../validation/validationContract.js';

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
    
    const {name, email, password, confirmPassword, birthDate, country, state, roles, active} = req.body;
    if (!name || !email || !password) return res.status(405).json({message: 'Nome, email e senha são campos obrigatórios.'});

    try {
        const contract = new ValidationContract();
        
        //Validações de nome
        contract.isRequired(name, 'O nome é obrigatório. ');
        contract.hasMinLen(name, 3, 'O nome deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(name, 255, 'O nome deve conter no máximo 255 caracteres. ');
        
        //Validações de e-mail
        contract.isEmail(email, 'E-mail inválido. ');
        contract.isRequired(email, 'O e-mail é obrigatório. ');
        contract.hasMinLen(email, 3, 'O e-mail deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(email, 128, 'O e-mail deve conter no máximo 128 caracteres. ');
        const duplicate = await User.findOne({email}).select('email').lean().exec();
        if (duplicate) return res.sendStatus(409); // Conflito
        
        //Validações de senha
        contract.isRequired(password, 'A senha é obrigatória. ');
        contract.hasMinLen(password, 6, 'A senha deve conter pelo menos 6 caracteres. ');
        contract.isNotEquals(password, confirmPassword, 'A confirmação de senha não confere. ');
        const hashPwd = await bcrypt.hash(password, Number(process.env.SALT_KEY));

        contract.isRequired(req.body.birthDate, 'A data de nascimento é obrigatória. ');

        if(!contract.isValid()){
            res.status(405).send(contract.errors()).end();
            return;
        }

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