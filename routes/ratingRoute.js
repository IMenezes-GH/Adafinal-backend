import { Router } from "express";
import { createRating, getRating } from "../controllers/ratingController.js";

const router = Router();

router.route('/')
    .get(getRating)
    .post(createRating)
    .patch((req, res) => {return res.json({message: "Patch rating"})})
    .delete((req, res) => {return res.json({message: "Delete rating"})})

export default router;