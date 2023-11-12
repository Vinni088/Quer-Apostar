import { Router } from 'express';
import httpStatus from "http-status";
import { Request, Response } from "express";

const participantsRouter = Router();

participantsRouter.get('/participants', (req: Request, res: Response) => {
    res.status(httpStatus.OK).send("Rota Get participants");
});
participantsRouter.post('/participants', (req: Request, res: Response) => {
    res.status(httpStatus.OK).send("Rota Post participants");
});

export { participantsRouter };
