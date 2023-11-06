import jwt from "jsonwebtoken";

const JWTVerify = (req, res, next) => {
    const authHeader = req.headers.authorization || req.header.Authorization;
    if (!authHeader?.startsWith('Bearer')) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded) => {
            if (err && decoded.roles !== 'admin') return res.sendStatus(403);
            req.userData = decoded;
            next()
            
        }
    )
}


export default JWTVerify