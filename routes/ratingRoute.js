import { Router } from "express";

const router = Router();

router.route('/')
    .get((req, res) => {return res.json({message: "Rating"})})
    .post((req, res) => {return res.json({message: "Post rating"})})
    .patch((req, res) => {return res.json({message: "Patch rating"})})
    .delete((req, res) => {return res.json({message: "Delete rating"})})

export default router;