import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const handleLogin = async (req, res) => {

    const {email, password, confirmPassword} = req.body;
    if (!email || !password || !confirmPassword) return res.status(400).send({message: 'Email e senhão são campos obrigatórios.'});

    try {
        
        if (password !== confirmPassword) return res.status(401);

        const user = await User.findOne({email}).exec();
        if (!user) return res.sendStatus(404);

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send({message: "Senha incorreta"});

        const accessToken = jwt.sign(
        {
            email : user.email,
            name: user.name,
            birthdate: user.birthdate,
            country: user.country,
            state: user.state,
            roles: user.roles
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '10s',
        }
        )

        const refreshToken = jwt.sign({
            email: user.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '30s'
        })
    
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('jwt',
            refreshToken,
            {
            httpOnly: true,
            // secure: true, // Habilitar em PROD
            sameSite: 'None',
            maxAge: 1000 * 30 }
        )

        res.json({token: accessToken});

    } catch (err){
        res.status(500).json({message: err.message});
    }

}

export const handleLogout = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(208);
    const refreshToken = cookies.jwt;
    try {

        const user = await User.findOne({refreshToken}).exec();
        if (!user) return res.status(404).sendStatus({message: 'Usuário não encontrado'});
        user.refreshToken = '';
        await user.save();

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.sendStatus(208);

    } catch (err){
        res.status(500).json({message: err.message});
    }
}