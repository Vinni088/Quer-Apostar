import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema';
import { createBetSchema, createGameSchema, finishBetSchema } from "../schemas/post.schemas"
import * as gamesController from "../controllers/games.controller"

const gamesRouter = Router();

gamesRouter.get('/games', gamesController.getGamesController);

gamesRouter.get('/games/:id', gamesController.getGameByIdController);

gamesRouter.post('/games', validateSchema(createGameSchema), gamesController.postGamesController);

gamesRouter.post('/games/:id/finish', validateSchema(finishBetSchema), gamesController.finishGameController);

gamesRouter.post('/bets', validateSchema(createBetSchema), gamesController.postBetController);


export { gamesRouter };
