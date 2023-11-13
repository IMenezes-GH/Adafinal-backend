import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';
import {stringToBool} from '../util/parseUtil.js';


const SECURE_COOKIES = stringToBool(process.env.SECURE_COOKIES ?? 'true'); // Ambiente de desenvolvimento false, Prod TRUE
console.log(chalk.bold.yellowBright(`SECURE_COOKIES IS SET TO: ${chalk.underline.blueBright(SECURE_COOKIES)}`))

/**
 * @desc Login de usuário
 * @route POST /auth/login
 * @access PUBLIC
 */
export const handleLogin = async (req, res) => {
    // #swagger.tags = ['Auth']

    const {email, password} = req.body;
    if (!email || !password) return res.status(400).send({message: 'Email e senha são campos obrigatórios.'});

    try {
        const user = await User.findOne({email}).exec();
        if (!user) return res.status(404).send({message: 'Email ou senha incorreta.'});

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send({message: "Email ou senha incorreta."});

        const lastLogin = new Date();
        const userData = {
            id: user._id,
            email : user.email,
            name: user.name,
            username: user.username,
            birthdate: user.birthdate,
            country: user.country,
            state: user.state,
            description: user.description,
            roles: user.roles,
            lastLogin: lastLogin,
            profileImageURL: user.profileImageURL
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
                id: user._id,
                email: user.email, 
                username: user.username,
                lastLogin: user.lastLogin },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '3d' }
        )
    
        user.refreshToken = refreshToken;
        user.lastLogin = lastLogin;
        user.active = true;
        await user.save();

        res.cookie('jwt',
            refreshToken,
            {
            httpOnly: true,
            secure: SECURE_COOKIES, // Habilitar em PROD
            sameSite: 'None',
            maxAge: 1000 * 60 * 60 * 24 * 3 } // 3 dias
        )

        res.json({token: accessToken, user: userData});

    } catch (err){
        res.status(500).json({message: err.message});
    }

}

/**
 * @desc Logout de usuário
 * @route POST /auth/logout
 * @access PUBLIC
 */
export const handleLogout = async (req, res) => {
    // #swagger.tags = ['Auth']

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(208);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: SECURE_COOKIES, // Habilitar em PROD
        sameSite: 'None'
    });

    try {
        const user = await User.findOne({refreshToken}).exec();
        if (!user) return res.status(404).send({message: 'Usuário não encontrado'});
        
        user.refreshToken = '';
        await user.save();

        res.sendStatus(208);

    } catch (err){
        res.status(500).json({message: err.message});
    }
}

export const handleRefresh = async (req, res) => {
    // #swagger.tags = ['Auth']

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({message: "Refresh JWT foi não encontrado."});
    const refreshJWT = cookies.jwt;

    jwt.verify(
            refreshJWT,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.status(403).json({message: "Forbidden"});
                
                const id = decoded.id; // ID do usuário encontrado no cookie
                const foundUser = await User.findById(id).exec();
                if (!foundUser) return res.sendStatus(404);
                if (foundUser && refreshJWT !== foundUser.refreshToken){
                    // Acionado caso usuário tente utilizar um refreshToken com dados válidos, mas não atual.
                    // Por razões de segurança, o token ligado ao banco de dados é limpado,
                    // e o estado de atividade da conta é forçada para false, impossibilitando que o usuário logado faça alterações na conta.
                    // Isso força o usuário à refazer o login para gerar um novo token e resetar o atributo ativo da conta para true.

                    console.log(chalk.red(`Tentativa de reutilização de token antigo detectada para o usuário ${chalk.bgBlack.whiteBright.bold(foundUser._id)}. Token refresh foi revogado.`))
                    foundUser.refreshToken = '';
                    foundUser.active = false;
                    await foundUser.save();
                    return res.sendStatus(403);
                }

                const lastLogin = new Date();

                const userData = {
                    id: foundUser._id,
                    email : foundUser.email,
                    name: foundUser.name,
                    username: foundUser.username,
                    birthdate: foundUser.birthdate,
                    country: foundUser.country,
                    state: foundUser.state,
                    description: foundUser.description,
                    roles: foundUser.roles,
                    lastLogin: lastLogin,
                    profileImageURL: foundUser.profileImageURL
                }

                const newAccessToken = jwt.sign(
                    userData,
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '15m',
                    }
                )

                const newRefreshToken = jwt.sign({
                    id: foundUser._id,
                    username: foundUser.username,
                    email: foundUser.email,
                    lastLogin: lastLogin
                    },
                    process.env.REFRESH_TOKEN_SECRET,
                    {
                        expiresIn: '3d'
                    }
                )

                foundUser.refreshToken = newRefreshToken;
                await foundUser.save();
                
                res.cookie('jwt', newRefreshToken,
                  {
                    httpOnly: true,
                    secure: SECURE_COOKIES, // Habilitar em PROD
                    sameSite: 'None', 
                    maxAge: 1000 * 60 * 60 * 25 * 3}
                )
            
                res.json({token: newAccessToken, user: userData});
            
            }    
    )
}