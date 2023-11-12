import prisma from "../database";

export async function readParticipants() {
    let res = await prisma.participants.findMany()

    return res
}

export async function createParticipants(name: string, balance: number) {
    let res = await prisma.participants.create({
        data: {
            name,
            balance
        }
    })

    return res
}