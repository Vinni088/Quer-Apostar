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
    if (isNaN(gameId) || gameId <= 0) {
        throw ({
            type: 'invalidId',
            message: 'O id informado não é válido'
        })
    }
    gameId = Number(gameId)
    let game = await gamesRepository.checkGame(gameId);

    if (game === null) {
        throw ({
            type: 'notFound',
            message: 'O id informado não pertence à um jogo existente'
        })
    }
    
    if (game.isFinished === true) {
        throw ({
            type: 'invalidId',
            message: 'Não se pode finalizar um jogo que já está terminado'
        })
    }

    let resposta = await gamesRepository.createBetFinish(homeTeamScore, awayTeamScore, gameId);

    await gamesRepository.betFinishCollaterals(homeTeamScore, awayTeamScore, gameId)

    return resposta
}

export async function createBet(homeTeamScore: any, awayTeamScore: any, amountBet: any, gameId: any, participantId: any,) {
    // Participante válido?
    if (isNaN(participantId) || participantId <= 0) {
        throw ({
            type: 'invalidId',
            message: 'O id informado não é válido'
        })
    }
    participantId = Number(participantId)
    let participant = await gamesRepository.checkParticipant(participantId);
    if (participant === null) {
        throw ({
            type: 'notFound',
            message: 'O id informado não pertence à um participante'
        })
    }
    if (participant.balance < amountBet) {
        throw ({
            type: 'conflict',
            message: 'O valor apostado é mais alto do que o balance deste jogador'
        })
    }

    // Jogo pode ter apostas?
    if (isNaN(gameId) || gameId <= 0) {
        throw ({
            type: 'invalidId',
            message: 'O id informado não é válido'
        })
    }
    gameId = Number(gameId)
    let game = await gamesRepository.checkGame(gameId);
    if (game === null) {
        throw ({
            type: 'notFound',
            message: 'O id informado não pertence à um jogo'
        })
    }
    if (game.isFinished === true) {
        throw ({
            type: 'invalidId',
            message: 'Não se pode apostar num jogo que já está terminado'
        })
    }

    let resposta = await gamesRepository.createBet(homeTeamScore, awayTeamScore, amountBet, gameId, participantId)

    return resposta
}