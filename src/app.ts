import express, { Request, Response, json } from "express";
import errorMiddleware from "./middlewares/errorMiddleware";
import httpStatus from "http-status";
import "express-async-errors";
import cors from 'cors';
import { participantsRouter } from "./routers/participants.router";
import { gamesRouter } from "./routers/games.router";

// configs iniciais:
const app = express();
app.use(json());
app.use(cors())

// routers usados
app.use(gamesRouter);
app.use(participantsRouter);

// rota health
app.get("/health", (req: Request, res: Response) => {
  res.status(httpStatus.OK).send("I'm ok!");
});

// Middleware de tratamento de erros
app.use(errorMiddleware);

export default app;