import { Router } from "express";

const router = Router();

router.route('/')
    .get((req, res) => {return res.json({message: "Game"})})
    .post((req, res) => {return res.json({message: "Post game"})})
    .patch((req, res) => {return res.json({message: "Patch game"})})
    .delete((req, res) => {return res.json({message: "Delete game"})})

export default router;