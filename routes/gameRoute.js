import { Router } from "express";
import { getAllGames, getGameById, createGame, updateGame, deleteGame } from "../controllers/gameController.js";
import JWTVerify from "../middleware/JWTVerify.js";
import verifyRole from "../middleware/VerifyRole.js";

const router = Router();



router.route('/all')
.get(getAllGames)


router.route('/').get(getGameById)

router.use(JWTVerify);
router.route('/')
    .post(verifyRole('admin'), createGame)
    .patch(verifyRole('admin'), updateGame)
    .delete(verifyRole('admin'), deleteGame)


export default router;