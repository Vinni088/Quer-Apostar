import * as gameService from "../services/games.services"
import { Request, Response } from 'express';
import httpStatus from 'http-status';


export async function getGamesController(req: Request, res: Response) {
    const games = await gameService.getGames()

    return res.status(httpStatus.OK).send(games);
}

export async function getGameByIdController(req: Request, res: Response) {
    const { id } = req.params

    const gameAndBets = await gameService.getGameById(id)

    return res.status(httpStatus.OK).send(gameAndBets);
}

export async function postGamesController(req: Request, res: Response) {
    const { homeTeamName, awayTeamName } = req.body;

    let resposta = await gameService.createGame(homeTeamName, awayTeamName);

    return res.status(httpStatus.CREATED).send(resposta);
}

export async function finishGameController(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamScore, awayTeamScore } = req.body

    let resposta = await gameService.finishGame(homeTeamScore, awayTeamScore, id)

    return res.status(httpStatus.OK).send(resposta);
}

export async function postBetController(req: Request, res: Response) {
    const { homeTeamScore, awayTeamScore, amountBet, gameId, participantId } = req.body

    let resposta = await gameService.createBet(homeTeamScore, awayTeamScore, amountBet, gameId, participantId)

    return res.status(httpStatus.CREATED).send(resposta);
}
