import httpStatus from 'http-status';
import supertest from 'supertest';
import factory from '../factories/factories.index';
import app from '../../src/app'

beforeEach(async () => {
    await factory.clearDB()
});

const server = supertest(app);

describe('POST /users', () => {
    it('should respond with status 400 when body is not given', async () => {
        const response = await server.post('/participants');

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should respond with status 422 when body does not containg name', async () => {
        const response = await server.post('/participants').send({
            balance: 10000
        });;

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should respond with status 422 when body does not containg balance', async () => {
        const response = await server.post('/participants').send({
            name: 'Vinni'
        });

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should respond with status 422 when body has balance too low', async () => {
        const response = await server.post('/participants').send({
            name: 'Vinni',
            balance: 900
        });

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should respond with status 201 when body is ok', async () => {
        const response = await server.post('/participants').send({
            name: 'Vinni',
            balance: 5000
        });

        expect(response.status).toBe(httpStatus.CREATED);
    });
});

describe('get /users', () => {
    it('should respond with 200 and empty array', async () => {
        const response = await server.get('/participants')

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveLength(0)
    });

    it('should respond with 200 and array with one', async () => {
        factory.createParticipant('Vinni', 10000)
        const response = await server.get('/participants')

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveLength(1)
    });
});
