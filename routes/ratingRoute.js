import { Router } from "express";
import { createRating, getRating, updateRating } from "../controllers/ratingController.js";
import JWTVerify from "../middleware/JWTVerify.js";

const router = Router();

router.route('/')
    .get(getRating)
    .post(JWTVerify, createRating)
    .patch(JWTVerify, updateRating)
    // .delete((req, res) => {return res.json({message: "Delete rating"})})

export default router;