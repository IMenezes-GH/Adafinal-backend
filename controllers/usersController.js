import mongoose, { isValidObjectId } from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import ValidationContract from '../validation/validationContract.js';
import Rating from '../models/Rating.js';
import Game from '../models/Game.js';
import jwt from 'jsonwebtoken'
import chalk from 'chalk';
import { stringToBool } from '../util/parseUtil.js';

const SECURE_COOKIES = stringToBool(process.env.SECURE_COOKIES ?? 'true'); // Ambiente de desenvolvimento false, Prod TRUE
console.log(chalk.bold.yellowBright(`SECURE_COOKIES IS SET TO: ${chalk.underline.blueBright(SECURE_COOKIES)}`))


/**
 * @desc Recupera uma lista de usuários
 * @route GET /users?min=param1&max=param2&name=param3
 * @access PUBLIC
 */
export const getUsers = async (req, res) => {
    // #swagger.tags = ['Users']
    const min = req.query.min || 0;
    const max = req.query.max || 50;
    const name = req.query.name || '   ';
    const username = req.query.username || '   ';

    if (isNaN(min) || isNaN(max)) return res.status(405).json({message: 'min e máx precisam ser valores númericos.'});
    if(max > 50) return res.status(405).json({message: "Limite de no máximo 50 usuários por pesquisa."});

    try {
        const users = await User.find({$or: [{username: username}, {name: {$regex: name}}]})
        .skip(min)
        .limit(max)
        .select('-password -refreshToken')
        .lean().exec();

        res.json(users);

    } catch (err){
        res.status(500).json(err.message);
    }
}


/**
 * @desc GET um único usuário utilizando _id ou email do usuário, por parâmetro ou query.
 * @route GET /users/:username, GET /users?_id=param1
 * @access PUBLIC
 */
export const getUser = async (req, res) => {
    // #swagger.tags = ['Users']
    const username = req.params.username || req.query.username;
    const _id = req.query._id;
    const email = req.query.email;

    if (!username && !email && !_id) return res.redirect('/users/all');
    try {
        const user = await User.findOne(
            { $or: [{email}, {username: username}, {_id: _id}] })
                .select('-password -refreshToken')
                .lean().exec();
        if (!user) return res.status(404).json({message: 'Usuário não foi encontrado.'});

        res.json(user);

    } catch (err) {
        res.status(500).json(err.message);
    } 
}

/**
 * @desc Cadastra um usuário
 * @route POST /users
 * @access PUBLIC
 */
export const createUser = async (req, res) => {
    // #swagger.tags = ['Users']
    const {name, email, username, password, confirmPassword, birthDate, country, state, roles, active} = req.body;
    if (!name || !email || !password || !username) return res.status(400).json({message: 'Nome, email, username e senha são campos obrigatórios.'});
    try {
        const contract = new ValidationContract();
        
        //Validações de nome
        contract.isRequired(name, 'O nome é obrigatório. ');
        contract.hasMinLen(name, 3, 'O nome deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(name, 255, 'O nome deve conter no máximo 255 caracteres. ');
        
        //Validações de usuário
        contract.isRequired(username, 'O nome de usuário é obrigatório. ');
        contract.hasMinLen(username, 3, 'O nome de usuário deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(username, 255, 'O nome de usuário deve conter no máximo 255 caracteres. ');

        //Validações de e-mail
        contract.isEmail(email, 'E-mail inválido. ');
        contract.isRequired(email, 'O e-mail é obrigatório. ');
        contract.hasMinLen(email, 3, 'O e-mail deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(email, 128, 'O e-mail deve conter no máximo 128 caracteres. ');

        const duplicate = await User.findOne({email}).select('email').lean().exec();
        if (duplicate) return res.status(409).send({message: "Email já em uso."}); // Conflito, email já em uso
        
        //Validações de senha
        contract.isRequired(password, 'A senha é obrigatória. ');
        contract.hasMinLen(password, 6, 'A senha deve conter pelo menos 6 caracteres. ');
        contract.isNotEquals(password, confirmPassword, 'A confirmação de senha não confere. ');
        const hashPwd = await bcrypt.hash(password, Number(process.env.SALT_KEY)); // NÃO UTILIZE UM VALOR MAIOR QUE 20 PARA A SALTKEY, PODE ENGARRAFAR O DEPLOY DA VERCEL
        
        contract.isRequired(req.body.birthDate, 'A data de nascimento é obrigatória. ');
        contract.isOlder(req.body.birthDate, 13, 'Usuário precisa ter no mínimo 13 anos de idade.');

        if(!contract.isValid()){
            res.status(405).send(contract.errors()).end();
            return;
        }
        
        const newUser = {
            name,
            email,
            username,
            password : hashPwd,
            birthDate,
            country,
            state,
            roles,
            active
        }
        
        const createdUser = await User.create(newUser);
        console.log(chalk.blue('usuário criado:', createUser))
        res.status(201).json({message: `Usuário: ${createdUser._id} criado.`});

    } catch (err) {
        res.status(500).json(err.message);
    } 
}


/**
 * @desc Atualiza um usuário
 * @route PATCH /users
 * @access PRIVATE
 */
export const updateUser = async (req, res) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    const {_id, name, email, username, description, profileImageURL, bannerImageURL, password, birthDate, country, state} = req.body;

    if (!name && !email && !username) return res.status(400).json({message: 'Nome, email ou usuário são campos obrigatórios.'});
    try {
        const user = await User.findById(_id).exec();
        if (!user.active) return res.sendStatus(403);

        const contract = new ValidationContract();
        //Validações de nome
        contract.hasMinLen(name, 3, 'O nome deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(name, 255, 'O nome deve conter no máximo 255 caracteres. ');

        //Validações de usuário
        contract.isRequired(username, 'O nome de usuário é obrigatório. ');
        contract.hasMinLen(username, 3, 'O nome de usuário deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(username, 255, 'O nome de usuário deve conter no máximo 255 caracteres. ');
        
        //Validações de e-mail
        contract.isEmail(email, 'E-mail inválido. ');
        contract.hasMinLen(email, 3, 'O e-mail deve conter pelo menos 3 caracteres. ');
        contract.hasMaxLen(email, 128, 'O e-mail deve conter no máximo 128 caracteres. ');

        const duplicate = await User.findOne({email}).select('-password').lean().exec();
        if (duplicate && duplicate._id.toString() !== _id) return res.sendStatus(409); // Conflito
        
        //Validações de senha
        contract.hasMinLen(password, 6, 'A senha deve conter pelo menos 6 caracteres. ');

        user.name = name ?? user.name;
        user.username = username ?? user.username;
        user.description = description ?? user.description;
        user.profileImageURL = profileImageURL ?? user.profileImageURL;
        user.email = email ?? user.email;
        user.birthDate = birthDate ?? user.birthDate;
        user.country = country ?? user.country;
        user.state = state ?? user.state;
        user.bannerImageURL = bannerImageURL ?? user.bannerImageURL;
        
        
        if (password) {
            const hashPwd = await bcrypt.hash(password, Number(process.env.SALT_KEY));
            user.password = hashPwd;
        }
        
        const updatedUser = await user.save();
        // REGEN JWT

        const userData = {
            _id: updatedUser._id,
            email : updatedUser.email,
            name: updatedUser.name,
            username: updatedUser.username,
            birthdate: updatedUser.birthdate,
            country: updatedUser.country,
            state: updatedUser.state,
            description: updatedUser.description,
            roles: updatedUser.roles,
        }

        const accessToken = jwt.sign(
            userData,
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '15m',
            }
        )

        const refreshToken = jwt.sign(
            { 
                _id: user._id,
                email: user.email, 
                username: user.username,
                lastLogin: user.lastLogin },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '3d' }
        )
    
        updatedUser.refreshToken = refreshToken;
        updatedUser.active = true;

        await updatedUser.save();

        if (updatedUser){
            res.cookie('jwt',
                refreshToken,
                {
                httpOnly: true,
                secure: SECURE_COOKIES, // Habilitar em PROD
                sameSite: 'None',
                maxAge: 1000 * 60 * 60 * 24 * 3 } // 3 dias
            )
            return res.json({message: 'Usuário atualizado.', token: accessToken, user: userData});
        }
        else return res.sendStatus(400);

    } catch (err) {
        res.status(500).json(err.message);
    } 
}

/**
 * @desc Deleta um usuário
 * @route DELETE /users
 * @access PRIVATE
 */
export const deleteUser = async (req, res) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
        "bearerAuth": []
    }] */
    const {_id} = req.body;
    if (!_id) return res.status(400).json({message: 'Id é obrigatório'});

    try {
        const user = await User.findById(_id).exec();
        if (!user.active) return res.sendStatus(403);
        if (!user) return res.sendStatus(404);

        const deletedUser = await user.deleteOne();
        return res.json({message: `usuário ${deletedUser.email} deletado`})

    } catch (err) {
        res.status(500).json(err.message);
    } 
}


/**
 * @desc GET Recomendações de jogos para um usuário
 * @route GET /users/:_id/recommendations
 * @access PRIVATE
 */
export const getRecommendations = async (req, res) => {

    const limit = req.query.max || 10;
    const userID = req.params._id;
    if (!isValidObjectId(userID)) return res.status(400).send({message: "Usuário inválido."});

    try {
        const user = await User.findById(userID).select('-password').lean().exec();
        if (!user) return res.sendStatus(404);

        const topRatings = await Rating.find({user: userID}).sort({score: 'desc'}).limit(5).exec(); 
        const favouriteCategory = topRatings.map(async (rating) => {
            const game = await Game.findById(rating.game).exec();
            const category = game.category;
         
            return category;
        })
        
        const gameRecommendations = await Game.find({category: {$in: favouriteCategory}}).limit(limit).exec();
        res.json(gameRecommendations);
        

    } catch (err){
        res.status(500).json(err.message);
    }

}