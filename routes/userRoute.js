import { Router } from "express";
import { getUserById, createUser } from "../controllers/usersController.js";

const router = Router();

router.route('/')
    .get(getUserById)
    .post(createUser)
    .patch((req, res) => {return res.json({message: "Patch user"})})
    .delete((req, res) => {return res.json({message: "Delete user"})})

router.route('/:id')
    .get(getUserById)

export default router;