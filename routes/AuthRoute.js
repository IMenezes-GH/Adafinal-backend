import { Router } from "express";
import { handleLogin, handleLogout, handleRefresh } from "../controllers/authController.js";

const router = Router();

router.route('/login').post(handleLogin).all((req,res) => {res.sendStatus(405)});
router.route('/logout').post(handleLogout);
router.route('/refresh').get(handleRefresh);

export default router;