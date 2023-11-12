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

export async function createBet(
    homeTeamScore: number,
    awayTeamScore: number,
    amountBet: number,
    gameId: number,
    participantId: number
) {
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
        data: {
            balance: {
                decrement: amountBet
            }
        }
    })
    return res
}

export async function readGames() {
    let res = await prisma.games.findMany()

    return res
}

export async function createBetFinish(
    homeTeamScore: number,
    awayTeamScore: number,
    gameId: number,
) {
    let res = await prisma.games.update({
        where: { id: gameId },
        data: {
            homeTeamScore,
            awayTeamScore,
            isFinished: true,
        }
    })

    return res
}

export async function betFinishCollaterals(
    homeTeamScore: number,
    awayTeamScore: number,
    gameId: number
) {
    let totalApostado = await prisma.bets.aggregate({
        where: { id: gameId },
        _sum: {
            amountBet: true
        }
    }) as any;

    let numeroDeApostasVencidos = await prisma.bets.count({
        where: {
            homeTeamScore,
            awayTeamScore
        }
    });

    let aposadoresGanhadores = await prisma.participants.findMany({
        where: {
            bets: {
                every: {
                    homeTeamScore,
                    awayTeamScore
                }
            }
        }
    });

    let quantiaGanha = totalApostado / numeroDeApostasVencidos;

    const agora = new Date()

    /* Efeito nos perdedores: só nas bets */
    await prisma.bets.updateMany({
        where: {
            homeTeamScore: { not: homeTeamScore },
            awayTeamScore: { not: awayTeamScore }
        },
        data: {
            Status: 'LOST',
            amountWon: 0,
            updatedAt: agora
        }
    });


    /* Efeito nos vencedores */
    /* efeito nas bets */
    await prisma.bets.updateMany({
        where: {
            homeTeamScore,
            awayTeamScore
        },
        data: {
            Status: 'WON',
            amountWon: quantiaGanha,
            updatedAt: agora
        }
    });

    /* efeito nos balances */
    console.log(quantiaGanha);
    aposadoresGanhadores.forEach(async (apostador) => {
        await prisma.participants.update({
            where: {
                id: apostador.id
            },
            data: {
                balance: {
                    increment: quantiaGanha
                }
            }
        })
    });

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