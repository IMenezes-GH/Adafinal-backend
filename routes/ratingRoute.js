import { Router } from "express";
import { createRating, getRating } from "../controllers/ratingController.js";
import JWTVerify from "../middleware/JWTVerify.js";

const router = Router();

router.route('/')
    .get(getRating)
    .post(JWTVerify, createRating)
    .patch((req, res) => {return res.json({message: "Patch rating"})})
    .delete((req, res) => {return res.json({message: "Delete rating"})})

export default router;