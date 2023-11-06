import { Router } from "express";
import { getUserById, createUser, updateUser, deleteUser } from "../controllers/usersController.js";
import JWTVerify from "../middleware/JWTVerify.js";

const router = Router();

router.route('/')
    .get(getUserById)
    .post(createUser)
    .patch(updateUser)
    .delete(deleteUser)

router.use(JWTVerify);
router.route('/:id')
    .get(getUserById)

export default router;