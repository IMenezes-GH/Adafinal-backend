import jwt from "jsonwebtoken";

const JWTVerify = (req, res, next) => {
    const authHeader = req.headers.authorization || req.header.Authorization;
    if (!authHeader?.startsWith('Bearer')) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    console.log(token)

    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded) => {
            console.log(err, decoded)
            if (user.roles = 'admin') {
                req.user = decoded;
                next();
            }
            else {
                if (err) return res.sendStatus(403);
                req.user = decoded;
                next()
            }
        }
    )
}


export default JWTVerify