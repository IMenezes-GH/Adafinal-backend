import { Router } from "express";
import { getAllGames, getGameById, createGame, updateGame, deleteGame } from "../controllers/gameController.js";

const router = Router();

router.route('/all')
    .get(getAllGames)

router.route('/')
    .get(getGameById)
    .post(createGame)
    .patch(updateGame)
    .delete(deleteGame)


export default router;