import { Router } from "express";
import { userLogin } from "../controllers/authController.js";

const router = Router();

router.route('/login').post(userLogin).all((req,res) => {res.sendStatus(405)});
router.route('/logout').post().all((req,res) => {res.sendStatus(405)});
router.route('/refresh').get();

export default router;