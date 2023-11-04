import { Router } from "express";
import { getCategory, createNewCategory, updateCategory } from "../controllers/categoryController.js";

const router = Router();

router.route('/')
    .get(getCategory)
    .post(createNewCategory)
    .patch(updateCategory)

router.route('/:name')
    .get(getCategory)

export default router;