import * as gamesRepository from "../repositories/games.repository";


export async function getGames() {
    let resposta = await gamesRepository.readGames()

    return resposta
}

export async function getGameById(id: any) {
    id = Number(id)

    if (isNaN(id) || id < 0) {
        throw ({
            type: 'invalidId',
            message: 'O id informado não é válido'
        })
    }

    let resposta = await gamesRepository.readGameById(id)

    return resposta
}

export async function createGame(homeTeamName: string, awayTeamName: string) {
    let resposta = await gamesRepository.createGame(homeTeamName, awayTeamName)

    return resposta
}

export async function finishGame(homeTeamScore: any, awayTeamScore: any, gameId: any,) {
    if (isNaN(gameId) || gameId < 0) {
        throw ({
            type: 'invalidId',
            message: 'O id informado não é válido'
        })
    }
    gameId = Number(gameId)

    let resposta = await gamesRepository.createBetFinish(homeTeamScore, awayTeamScore, gameId);

    //await gamesRepository.betFinishCollaterals(homeTeamScore, awayTeamScore, gameId)

    return resposta
}

export async function createBet(homeTeamScore: any, awayTeamScore: any, amountBet: any, gameId: any, participantId: any,) {
    let resposta = await gamesRepository.createBet(homeTeamScore, awayTeamScore, amountBet, gameId, participantId)

    return resposta
}