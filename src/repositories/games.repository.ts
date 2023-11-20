import prisma from "../database";

export async function createGame(homeTeamName: string, awayTeamName: string) {
    let res = await prisma.games.create({
        data: {
            homeTeamName,
            awayTeamName,
            homeTeamScore: 0,
            awayTeamScore: 0,
            isFinished: false
        }
    })
    return res
}

export async function createBet(homeTeamScore: number, awayTeamScore: number, amountBet: number, gameId: number, participantId: number) {
    let res = await prisma.bets.create({
        data: {
            homeTeamScore,
            awayTeamScore,
            amountBet,
            gameId,
            participantId,
            Status: 'PENDING',
            amountWon: null
        }
    })

    let balanceEffect = await prisma.participants.update({
        where: { id: participantId },
        data: { balance: { decrement: amountBet } }
    })
    return res
}

export async function readGames() {
    let res = await prisma.games.findMany()

    return res
}

export async function createBetFinish(homeTeamScore: number, awayTeamScore: number, gameId: number) {
    let res = await prisma.games.update({
        where: { id: gameId },
        data: { homeTeamScore, awayTeamScore, isFinished: true }
    })

    return res
}

export async function betFinishCollaterals(homeTeamScore: number, awayTeamScore: number, gameId: number) {
    let { totalApostadoNum, totalApostadoVencidoNum, vencedores } = await calculateTotals(homeTeamScore, awayTeamScore, gameId)
    let houseFee = 0.97;
    let balanceWon: number;
    let agora = new Date();
    vencedores.forEach(async (bet) => {
        balanceWon = (bet.amountBet / totalApostadoVencidoNum) * (totalApostadoNum) * (houseFee);
        await prisma.bets.update({
            where: { id: bet.id },
            data: { Status: 'WON', amountWon: balanceWon, updatedAt: agora }
        });
        await prisma.participants.update({
            where: { id: bet.participantId },
            data: { balance: { increment: balanceWon } }
        })
    })
    await prisma.bets.updateMany({
        where: { homeTeamScore: { not: homeTeamScore }, awayTeamScore: { not: awayTeamScore } },
        data: { Status: 'LOST', amountWon: 0, updatedAt: agora }
    });
}

export async function calculateTotals(homeTeamScore: number, awayTeamScore: number, gameId: number) {
    let totalApostado = await prisma.bets.aggregate({
        where: { gameId },
        _sum: { amountBet: true }
    })
    let totalApostadoVencido = await prisma.bets.aggregate({
        where: { gameId, homeTeamScore, awayTeamScore },
        _sum: { amountBet: true }
    });
    let vencedores = await prisma.bets.findMany({
        where: { homeTeamScore, awayTeamScore }
    })

    let totalApostadoNum = totalApostado._sum.amountBet
    let totalApostadoVencidoNum = totalApostadoVencido._sum.amountBet
    return { totalApostadoNum, totalApostadoVencidoNum, vencedores }
}

export async function readGameById(id: number) {
    let res = await prisma.games.findFirst({
        where: {
            id
        },
        include: {
            bets: true
        }
    })

    return res
}

/* acessos incidentais: */
export async function checkParticipant(id: number) {
    let participant = await prisma.participants.findFirst({
        where: {
            id
        }
    })

    return participant
}

export async function checkGame(id: number) {
    let game = await prisma.games.findFirst({
        where: {
            id
        }
    })

    return game
}

