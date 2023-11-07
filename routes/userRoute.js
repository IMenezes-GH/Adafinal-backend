import { Router } from "express";
import { getUser, getUsers, createUser, updateUser, deleteUser } from "../controllers/usersController.js";
import JWTVerify from "../middleware/JWTVerify.js";

const router = Router();


router.route('/')
    .get(getUser)
    .post(createUser)
    .patch(JWTVerify, updateUser)
    .delete(JWTVerify, deleteUser);


router.route('/all')
    .get(getUsers);
    
router.route('/:id')
    .get(getUser);

export default router;