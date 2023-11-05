import { Router } from "express";
import { userLogin } from "../controllers/authController.js";

const router = Router();

router.route('/login').post(userLogin);
router.route('/logout').post();
router.route('/refresh').get();

export default router;