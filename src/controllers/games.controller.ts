//import * as gameService from "../services/games.services"
import { Request, Response } from 'express';
import httpStatus from 'http-status';


export async function getGamesController(req: Request, res: Response) {
    const games = 0

    return res.status(httpStatus.CREATED).json({ message: "em construção" });
}
