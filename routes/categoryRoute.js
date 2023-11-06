import { Router } from "express";
import { getCategory, createNewCategory, updateCategory } from "../controllers/categoryController.js";
import verifyRole from "../middleware/VerifyRole.js";

const router = Router();

router.route('/')
    .get(getCategory)
    .post(verifyRole('admin'), createNewCategory)
    .patch(verifyRole('admin'), updateCategory)

router.route('/:id')
    .get(getCategory)

export default router;