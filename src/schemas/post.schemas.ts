import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().required(),
    balance: Joi.number().required()
});

export const createGameSchema = Joi.object({
    homeTeamName: Joi.string().required(),
    awayTeamName: Joi.string().required()
});

export const createBetSchema = Joi.object({
    homeTeamScore: Joi.number().min(0).required(),
    awayTeamScore: Joi.number().min(0).required(),
    amountBet: Joi.number().required(),
    gameId: Joi.number().required(),
    participantId: Joi.number().required()
});


export const finishBetSchema = Joi.object({
    homeTeamScore: Joi.number().required(),
    awayTeamScore: Joi.number().required()
});