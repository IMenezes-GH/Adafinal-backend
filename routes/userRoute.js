import { Router } from "express";
import { getUser, getUsers, createUser, updateUser, deleteUser, getRecommendations } from "../controllers/usersController.js";
import JWTVerify from "../middleware/JWTVerify.js";

const router = Router();


router.route('/')
    .get(getUser)
    .post(createUser)
    .patch(JWTVerify, updateUser)
    .delete(JWTVerify, deleteUser);


router.route('/all')
    .get(getUsers);
    
router.route('/:username')
    .get(getUser);

router.route('/:id/recommendations')
    .get(getRecommendations);

export default router;