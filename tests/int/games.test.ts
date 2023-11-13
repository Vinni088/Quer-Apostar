import httpStatus from 'http-status';
import supertest from 'supertest';
import factory from '../factories/factories.index';
import app from '../../src/app'

beforeEach(async () => {
    await factory.clearDB()
});
afterEach(async () => {
    await factory.clearDB()
});

const server = supertest(app);

describe('post /games', () => {
    beforeEach(async () => {
        await factory.clearDB()
    });

    afterEach(async () => {
        await factory.clearDB()
    });
    it('should respond with status 422 when body is not given', async () => {
        const response = await server.post('/games');

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should respond with status 422 when body does not containg awayTeamName', async () => {
        const response = await server.post('/games').send({
            homeTeamName: "liverpool"
        });

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should respond with status 422 when body does not containg homeTeamName', async () => {
        const response = await server.post('/games').send({
            awayTeamName: "United"
        });

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should respond with status 201 when body does not containg homeTeamName', async () => {
        const response = await server.post('/games').send({
            homeTeamName: "liverpool",
            awayTeamName: "United"
        });

        expect(response.status).toBe(httpStatus.CREATED);
    });
});

describe('get /games', () => {
    beforeEach(async () => {
        await factory.clearDB()
    });
    afterEach(async () => {
        await factory.clearDB()
    });

    it('should respond with 200 and empty array', async () => {
        const response = await server.get('/games')

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveLength(0)
    });

    it('should respond with 200 and array with one', async () => {
        factory.createGame('Liverpool', 'Manchester United')
        const response = await server.get('/games')

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveLength(1)
    });
});

describe('get /games/id', () => {
    beforeEach(async () => {
        await factory.clearDB()
    });

    afterEach(async () => {
        await factory.clearDB()
    });
    it('should respond with status 422 when id invalid', async () => {
        let participant = await factory.createParticipant("Vinni", 100000);
        let game = await factory.createGame('Liverpool', 'Manchester United');
        let bet = await factory.createBet(3, 0, 5000, game.id, participant.id)

        const response = await server.get(`/games/${-1}`);

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);

    });
    it('should respond with 200 and especific object', async () => {
        let participant = await factory.createParticipant("Vinni", 100000);
        let game = await factory.createGame('Liverpool', 'Manchester United');
        let bet = await factory.createBet(3, 0, 5000, game.id, participant.id)

        const response = await server.get(`/games/${game.id}`);

        //console.log(response.body);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toMatchObject({
            awayTeamName: game.awayTeamName,
            awayTeamScore: 0,
            bets: [
                {
                    Status: "PENDING",
                    amountBet: bet.amountBet,
                    amountWon: null,
                    awayTeamScore: bet.awayTeamScore,
                    createdAt: expect.any(String),
                    gameId: game.id,
                    homeTeamScore: bet.homeTeamScore,
                    id: bet.id,
                    participantId: participant.id,
                    updatedAt: expect.any(String),
                },
            ],
            createdAt: expect.any(String),
            homeTeamName: game.homeTeamName,
            homeTeamScore: 0,
            id: game.id,
            isFinished: false,
            updatedAt: expect.any(String),
        })
    });
});

describe('post /bets', () => {
    beforeEach(async () => {
        await factory.clearDB()
    });
    afterEach(async () => {
        await factory.clearDB()
    });

    describe('Invalid body', () => {
        afterEach(async () => {
            await factory.clearDB()
        });

        it('should respond with status 422 when body is not given', async () => {
            const response = await server.post('/bets');

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should respond with status 422 when body does not have homeTeamScore', async () => {
            const response = await server.post('/bets').send({
                awayTeamScore: 0,
                amountBet: 1000,
                gameId: 1,
                participantId: 2
            });

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should respond with status 422 when body does not have awayTeamScore', async () => {
            const response = await server.post('/bets').send({
                homeTeamScore: 0,
                amountBet: 1000,
                gameId: 1,
                participantId: 2
            });

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should respond with status 422 when body does not have amountBet', async () => {
            const response = await server.post('/bets').send({
                homeTeamScore: 0,
                awayTeamScore: 0,
                gameId: 1,
                participantId: 2
            });

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should respond with status 422 when body does not have gameId', async () => {
            const response = await server.post('/bets').send({
                homeTeamScore: 0,
                awayTeamScore: 0,
                amountBet: 1000,
                participantId: 2
            });

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should respond with status 422 when body does not have participantId', async () => {
            const response = await server.post('/bets').send({
                homeTeamScore: 0,
                awayTeamScore: 0,
                amountBet: 1000,
                gameId: 1
            });

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
    })
    describe('Valid body through schema', () => {
        afterEach(async () => {
            await factory.clearDB()
        });

        it('should respond with status 422 when participantId invalid: type', async () => {
            let participant = await factory.createParticipant("Vinni", 100000);
            let game = await factory.createGame('Liverpool', 'Manchester United')

            const response = await server.post('/bets').send({
                homeTeamScore: 3,
                awayTeamScore: 0,
                amountBet: 1000,
                gameId: game.id,
                participantId: 'batata'
            });

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should respond with status 422 when participantId invalid: negative', async () => {
            let participant = await factory.createParticipant("Vinni", 100000);
            let game = await factory.createGame('Liverpool', 'Manchester United')

            const response = await server.post('/bets').send({
                homeTeamScore: 3,
                awayTeamScore: 0,
                amountBet: 1000,
                gameId: game.id,
                participantId: -6
            });

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should respond with status 404 when participantId belongs to no one', async () => {
            let participant = await factory.createParticipant("Vinni", 100000);
            let game = await factory.createGame('Liverpool', 'Manchester United')

            const response = await server.post('/bets').send({
                homeTeamScore: 3,
                awayTeamScore: 0,
                amountBet: 1000,
                gameId: game.id,
                participantId: participant.id + 1
            });

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('should respond with status 422 when gameId invalid: type', async () => {
            let participant = await factory.createParticipant("Vinni", 100000);
            let game = await factory.createGame('Liverpool', 'Manchester United')

            const response = await server.post('/bets').send({
                homeTeamScore: 3,
                awayTeamScore: 0,
                amountBet: 1000,
                gameId: 'game.id',
                participantId: participant.id
            });

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should respond with status 422 when gameId invalid: negative', async () => {
            let participant = await factory.createParticipant("Vinni", 100000);
            let game = await factory.createGame('Liverpool', 'Manchester United')

            const response = await server.post('/bets').send({
                homeTeamScore: 3,
                awayTeamScore: 0,
                amountBet: 1000,
                gameId: -game.id,
                participantId: participant.id
            });

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should respond with status 404 when gameId belongs to no game', async () => {
            let participant = await factory.createParticipant("Vinni", 100000);
            let game = await factory.createGame('Liverpool', 'Manchester United')

            const response = await server.post('/bets').send({
                homeTeamScore: 3,
                awayTeamScore: 0,
                amountBet: 1000,
                gameId: game.id + 1,
                participantId: participant.id
            });

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('should respond with status 422 when gameId is finished', async () => {
            let participant = await factory.createParticipant("Vinni", 100000);
            let game = await factory.createGame('Liverpool', 'Manchester United')
            await factory.finishGame(game.id)

            const response = await server.post('/bets').send({
                homeTeamScore: 3,
                awayTeamScore: 0,
                amountBet: 1000,
                gameId: game.id,
                participantId: participant.id
            });
            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });

        it('should respond with status 422 when participant has no balance fo bet', async () => {
            let participant = await factory.createParticipant("Vinni", 100000);
            let game = await factory.createGame('Liverpool', 'Manchester United')

            const response = await server.post('/bets').send({
                homeTeamScore: 3,
                awayTeamScore: 0,
                amountBet: participant.balance + 1,
                gameId: game.id,
                participantId: participant.id
            });
            expect(response.status).toBe(httpStatus.CONFLICT);
        });

        it('should respond with status 201 when everything ok', async () => {
            let participant = await factory.createParticipant("Vinni", 100000);
            let game = await factory.createGame('Liverpool', 'Manchester United')

            const response = await server.post('/bets').send({
                homeTeamScore: 3,
                awayTeamScore: 0,
                amountBet: 1000,
                gameId: game.id,
                participantId: participant.id
            });
            expect(response.status).toBe(httpStatus.CREATED);
        });
    })
});

describe('post /games/:id/finish', () => {
    beforeEach(async () => {
        await factory.clearDB()
    });
    afterEach(async () => {
        await factory.clearDB()
    });

    it('should respond with status 422 when id invalid: type', async () => {
        let participant = await factory.createParticipant("Vinni", 100000);
        let game = await factory.createGame('Liverpool', 'Manchester United')
        let bet = await factory.createBet(3, 0, participant.balance, game.id, participant.id)

        const response = await server.post('/games/batata/finish').send({
            homeTeamScore: 3,
            awayTeamScore: 0
        });
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should respond with status 422 when id invalid: negative', async () => {
        let participant = await factory.createParticipant("Vinni", 100000);
        let game = await factory.createGame('Liverpool', 'Manchester United')
        let bet = await factory.createBet(3, 0, participant.balance, game.id, participant.id)

        const response = await server.post('/games/-1/finish').send({
            homeTeamScore: 3,
            awayTeamScore: 0
        });
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should respond with status 404 when game id doesnt exist', async () => {
        let participant = await factory.createParticipant("Vinni", 100000);
        let game = await factory.createGame('Liverpool', 'Manchester United')
        let bet = await factory.createBet(3, 0, participant.balance, game.id, participant.id)

        const response = await server.post(`/games/${game.id + 1}/finish`).send({
            homeTeamScore: 3,
            awayTeamScore: 0
        });
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 when game id doesnt exist', async () => {
        let participant = await factory.createParticipant("Vinni", 100000);
        let game = await factory.createGame('Liverpool', 'Manchester United');
        let bet = await factory.createBet(3, 0, participant.balance, game.id, participant.id);
        let finish = await factory.finishGame(game.id);
        const response = await server.post(`/games/${game.id}/finish`).send({
            homeTeamScore: 3,
            awayTeamScore: 0
        });
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should respond with status 200 when everything ok', async () => {
        let participant = await factory.createParticipant("Vinni", 100000);
        let game = await factory.createGame('Liverpool', 'Manchester United');
        let bet = await factory.createBet(3, 0, participant.balance, game.id, participant.id);

        const response = await server.post(`/games/${game.id}/finish`).send({
            homeTeamScore: 3,
            awayTeamScore: 0
        });
        
        expect(response.status).toBe(httpStatus.OK);
    });
});