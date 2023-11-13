import prisma from "../../src/database";

async function clearDB() {
    await prisma.bets.deleteMany();

    await prisma.games.deleteMany();

    await prisma.participants.deleteMany();
}

async function createParticipant(name: string, balance: number) {
    let participant = await prisma.participants.create({
        data: {
            name,
            balance
        }
    })
    return participant
}

async function createGame(homeTeamName: string, awayTeamName: string) {
    let game = prisma.games.create({
        data: {
            homeTeamName,
            awayTeamName,
            awayTeamScore: 0,
            homeTeamScore: 0,
            isFinished: false
        }
    })
    return game
}

async function createBet(homeTeamScore: number, awayTeamScore: number, amountBet: number, gameId: number, participantId: number) {
    let bet = await prisma.bets.create({
        data: {
            homeTeamScore,
            awayTeamScore,
            amountBet,
            gameId,
            participantId,
            Status: 'PENDING'
        }
    })
    return bet
}
async function finishGame(id: number) {
    await prisma.games.update({
        where: {
            id
        },
        data:{
            isFinished: true,
            homeTeamScore: 0,
            awayTeamScore: 0
        }
    })
}
const factory = {
    clearDB, 
    createParticipant,
    createGame,
    createBet,
    finishGame
}

export default factory