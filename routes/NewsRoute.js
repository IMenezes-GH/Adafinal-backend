import { Router } from "express";
import { getNews, createNews, updateNews, deleteNews } from "../controllers/newsController.js";
import JWTVerify from "../middleware/JWTVerify.js";
import verifyRole from '../middleware/VerifyRole.js';

const router = Router();

router.route('/')
    .get(getNews)


// PROTECTED ROUTES
router.use(JWTVerify)

router.route('/')
    .post(verifyRole('admin') ,createNews)
    .patch(verifyRole('admin') ,updateNews)
    .delete(verifyRole('admin') ,deleteNews)


export default router;