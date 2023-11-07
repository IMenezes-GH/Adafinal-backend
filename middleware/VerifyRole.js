/**
 * Compara se o role presente na JWT está na lista de roles definida pela função. Se sim, permite o uso da rota, caso não retorna 401 (unauthorized) se o JWT não for encontrado, ou 403 (forbidden) se o usuário não tiver permissão para usar o recurso.
 * @param  {...string} roles Lista de roles permitidos para dada rota
 * @returns void
 */
const verifyRole = (...roles) => {
    return (req, res, next) => {
        console.log(req.userData)

        if (!req?.userData?.roles) return res.sendStatus(401);
        const userRole = req.userData.roles;

        const allowedRoles = [...roles];
        if (!allowedRoles.includes(userRole)) return res.sendStatus(403);

        next();
    }
}

export default verifyRole;