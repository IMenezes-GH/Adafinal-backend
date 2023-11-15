import { Router } from "express";
import { getAllGames, getGameById, getGamesByName, createGame, updateGame, deleteGame } from "../controllers/gameController.js";
import JWTVerify from "../middleware/JWTVerify.js";
import verifyRole from "../middleware/VerifyRole.js";

const router = Router();

router.route('/').get(getGamesByName) // QUERY game

router.route('/all').get(getAllGames) //Get all games
router.route('/:_id').get(getGameById) //Get a game by id

router.use(JWTVerify);
router.route('/')
    .post(verifyRole('admin', 'moderator'), createGame)
    .patch(verifyRole('admin', 'moderator'), updateGame)
    .delete(verifyRole('admin'), deleteGame)

    

export default router;