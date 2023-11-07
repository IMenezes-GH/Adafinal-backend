import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';

/**
 * @desc Login de usuário
 * @route POST /auth/login
 * @access PUBLIC
 */
export const handleLogin = async (req, res) => {
    // #swagger.tags = ['Auth']

    const {email, password, confirmPassword} = req.body;
    if (!email || !password || !confirmPassword) return res.status(400).send({message: 'Email e senhão são campos obrigatórios.'});

    try {
        
        if (password !== confirmPassword) return res.status(401);

        const user = await User.findOne({email}).exec();
        if (!user) return res.sendStatus(404);

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send({message: "Senha incorreta"});

        const lastLogin = new Date();

        const accessToken = jwt.sign(
            {
                id: user._id,
                email : user.email,
                name: user.name,
                birthdate: user.birthdate,
                country: user.country,
                state: user.state,
                roles: user.roles,
                lastLogin: lastLogin
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '15m',
            }
        )

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email, lastLogin: user.lastLogin },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '3d' }
        )
    
        user.refreshToken = refreshToken;
        user.lastLogin = lastLogin;
        await user.save();

        res.cookie('jwt',
            refreshToken,
            {
            httpOnly: true,
            // secure: true, // Habilitar em PROD
            sameSite: 'None',
            maxAge: 1000 * 60 * 60 * 24 * 3 } // 3 dias
        )

        res.json({token: accessToken, user: user._id});

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
        // secure: true,
        sameSite: 'None'
    });

    try {
        const user = await User.findOne({refreshToken}).exec();
        if (!user) return res.status(404).sendStatus({message: 'Usuário não encontrado'});
        
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
    console.log(cookies);
    const refreshJWT = cookies.jwt;
    jwt.verify(
            refreshJWT,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.status(403).json({message: "Forbidden"});
                
                const id = decoded.id;
                const foundUser = await User.findById(id).exec();
                if (!foundUser) return res.sendStatus(404);
                if (foundUser && refreshJWT !== foundUser.refreshToken){

                    console.log(chalk.red(`Tentativa de reutilização de token antigo detectada para o usuário ${chalk.bgBlack.whiteBright.bold(foundUser._id)}. Todos os Tokens para esse usuário foram invalidados.`))
                    foundUser.refreshToken = '';
                    foundUser.lastLogin = null;
                    await foundUser.save();
                    return res.sendStatus(403);
                }

                const lastLogin = new Date();

                const newAccessToken = jwt.sign(
                    {
                        id: foundUser._id,
                        email : foundUser.email,
                        name: foundUser.name,
                        birthdate: foundUser.birthdate,
                        country: foundUser.country,
                        state: foundUser.state,
                        roles: foundUser.roles,
                        lastLogin: lastLogin
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '15m',
                    }
                )

                const newRefreshToken = jwt.sign({
                    id: foundUser._id,
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
                    // secure: true, 
                    sameSite: 'None', 
                    maxAge: 1000 * 60 * 60 * 25 * 3}
                )
            
                res.json({token: newAccessToken, user: foundUser._id});
            
            }
            
            
    )

}