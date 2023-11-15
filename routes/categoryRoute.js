import { Router } from "express";
import { getCategory, createNewCategory, updateCategory } from "../controllers/categoryController.js";
import verifyRole from "../middleware/VerifyRole.js";
import JWTVerify from "../middleware/JWTVerify.js";

const router = Router();

router.route('/')
    .get(getCategory)
    .post(JWTVerify, verifyRole('admin'), createNewCategory)
    .patch(JWTVerify, verifyRole('admin'), updateCategory)

router.route('/:_id')
    .get(getCategory)

export default router;