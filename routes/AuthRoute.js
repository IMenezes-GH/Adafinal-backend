import { Router } from "express";
import { handleLogin, handleLogout, handleRefresh } from "../controllers/authController.js";

const router = Router();

router.route('/login').post(handleLogin);
router.route('/logout').post(handleLogout);
router.route('/refresh').get(handleRefresh);
router.route('/*').all((req,res) => {res.sendStatus(405)});

export default router;