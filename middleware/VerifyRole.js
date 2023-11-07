const verifyRole = (...roles) => {
    return (req, res, next) => {
        console.log(req.userData)

        if (!req?.userData?.roles) return res.sendStatus(401);
        const userRole = req.userData.roles;

        const allowedRoles = [...roles];
        if (!allowedRoles.includes(userRole)) return res.sendStatus(401);

        next();
    }
}

export default verifyRole;