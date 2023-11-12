import * as participantService from "../services/participants.services"
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function participantPost(req: Request, res: Response) {
    const { name, balance } = req.body;

    const participant = await participantService.postParticipant(name, balance)

    return res.status(httpStatus.CREATED).json(participant);
}

export async function participantGet(req: Request, res: Response) {
    const participants = await participantService.getParticipant()

    return res.status(httpStatus.OK).json(participants);
}