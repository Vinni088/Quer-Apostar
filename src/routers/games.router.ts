import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema';
import { createBetSchema, createGameSchema, finishBetSchema } from "../schemas/post.schemas"
import * as gamesController from "../controllers/games.controller"

const gamesRouter = Router();

gamesRouter.get('/games', gamesController.getGamesController );

gamesRouter.get('/games/:id', );

gamesRouter.post('/games', validateSchema(createGameSchema), );

gamesRouter.post('/games/:id/finish', validateSchema(finishBetSchema), );

gamesRouter.post('/bets', validateSchema(createBetSchema), );


export { gamesRouter };
