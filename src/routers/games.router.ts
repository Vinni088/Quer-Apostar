import { Router } from 'express';
import httpStatus from "http-status";
import { Request, Response } from "express";

const gamesRouter = Router();

gamesRouter.get('/games', (req: Request, res: Response) => {
    res.status(httpStatus.OK).send("Rota Get games");
});

gamesRouter.get('/games/:id', (req: Request, res: Response) => {
    res.status(httpStatus.OK).send("Rota Get games by id");
});

gamesRouter.post('/games', (req: Request, res: Response) => {
    res.status(httpStatus.OK).send("Rota Post games");
});

gamesRouter.post('/games/:id/finish', (req: Request, res: Response) => {
    res.status(httpStatus.OK).send("Rota Post games finish");
});

gamesRouter.post('/bets', (req: Request, res: Response) => {
    res.status(httpStatus.OK).send("Rota Post bets");
});


export { gamesRouter };
