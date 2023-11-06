import { Router } from "express";
import { getUser, getUsers, createUser, updateUser, deleteUser } from "../controllers/usersController.js";
import JWTVerify from "../middleware/JWTVerify.js";

const router = Router();

router.route('/all').get(getUsers);

router.route('/')
    .get(getUser)
    .post(createUser);
    
router.use(JWTVerify); //PRIVATE ROUTES
    
router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

export default router;