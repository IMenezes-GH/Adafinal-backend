import { Router } from "express";

const router = Router();

router.route('/')
    .get((req, res) => {return res.json({message: "Users"})})
    .post((req, res) => {return res.json({message: "Post user"})})
    .patch((req, res) => {return res.json({message: "Patch user"})})
    .delete((req, res) => {return res.json({message: "Delete user"})})

export default router;