import { Router } from "express";

const router = Router();

router.route('/')
    .get((req, res) => {return res.json({message: "Category"})})
    .post((req, res) => {return res.json({message: "Post category"})})
    .patch((req, res) => {return res.json({message: "Patch category"})})
    .delete((req, res) => {return res.json({message: "Delete category"})})

export default router;