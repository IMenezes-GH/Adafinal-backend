import { Router } from "express";
import { getUserById, createUser, updateUser, deleteUser } from "../controllers/usersController.js";

const router = Router();

router.route('/')
    .get(getUserById)
    .post(createUser)
    .patch(updateUser)
    .delete(deleteUser)

router.route('/:id')
    .get(getUserById)

export default router;