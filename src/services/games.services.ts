import * as gamesRepository from "../repositories/games.repository";

async function validateId(id: any) {
    let idNum = Number(id);

    if (isNaN(idNum) || idNum < 0) {
        throw ({
            type: 'invalidId',
            message: 'O id informado não é válido'
        })
    }
    return idNum
}

export async function getGames() {
    let resposta = await gamesRepository.readGames()

    return resposta
}

export async function getGameById(id: any) {
    id = await validateId(id)

    let resposta = await gamesRepository.readGameById(id)

    return resposta
}

export async function createGame(homeTeamName: string, awayTeamName: string) {
    let resposta = await gamesRepository.createGame(homeTeamName, awayTeamName)

    return resposta
}

export async function finishGame(homeTeamScore: any, awayTeamScore: any, gameId: any,) {
    gameId = await validateId(gameId);

    let game = await gamesRepository.checkGame(gameId);
    if (game === null) {
        throw ({ type: 'notFound', message: 'O id informado não pertence à um jogo existente' })
    } else if (game.isFinished === true) {
        throw ({ type: 'invalidId', message: 'Não se pode finalizar um jogo que já está terminado' })
    }

    let resposta = await gamesRepository.createBetFinish(homeTeamScore, awayTeamScore, gameId);
    await gamesRepository.betFinishCollaterals(homeTeamScore, awayTeamScore, gameId);
    return resposta;
}

export async function createBet(homeTeamScore: any, awayTeamScore: any, amountBet: any, gameId: any, participantId: any,) {
    if (amountBet <= 0) { throw ({ type: 'conflict', message: 'O valor apostado não é válido' }) }

    let participant = await gamesRepository.checkParticipant(await validateId(participantId));
    if (participant === null) {
        throw ({ type: 'notFound', message: 'O id informado não pertence à um participante' })
    } else if (participant.balance < amountBet) {
        throw ({ type: 'conflict', message: 'O valor apostado é mais alto do que o balance deste jogador' })
    }

    let game = await gamesRepository.checkGame(await validateId(gameId));
    if (game === null) {
        throw ({ type: 'notFound', message: 'O id informado não pertence à um jogo' })
    } else if (game.isFinished === true) {
        throw ({ type: 'invalidId', message: 'Não se pode apostar num jogo que já está terminado' })
    }

    let resposta = await gamesRepository.createBet(homeTeamScore, awayTeamScore, amountBet, gameId, participantId)
    return resposta
}