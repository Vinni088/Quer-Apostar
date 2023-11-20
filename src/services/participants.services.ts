import * as participantRepository from "../repositories/participants.repository"


export async function getParticipant() {
    let resposta = await participantRepository.readParticipants()

    return resposta
}

export async function postParticipant(name: string, balance: number) {
    if (balance < 1000) {
        throw ({ type: 'valorBaixo', message: 'Você não pode cadastrar um usuario com mneos de 10R$' })
    }

    let resposta = await participantRepository.createParticipants(name, balance)

    return resposta
}