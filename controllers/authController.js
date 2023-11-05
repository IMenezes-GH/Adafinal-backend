import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userLogin = async (req, res) => {

    const {email, password, confirmPassword} = req.body;
    if (!email || !password || !confirmPassword) return res.status(400).send({message: 'Email e senhão são campos obrigatórios.'});

    try {
        
        if (password !== confirmPassword) return res.status(401);

        const user = await User.findOne({email}).lean().exec();
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
    
        res.cookie('jwt',
            refreshToken,
            {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 1000 * 30 }
        )

        res.json({token: accessToken});

    } catch (err){
        res.status(500).json({message: err.message});
    }

}