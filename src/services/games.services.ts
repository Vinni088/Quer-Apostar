import * as gamesRepository from "../repositories/games.repository"


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