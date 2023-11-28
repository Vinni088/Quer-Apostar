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
app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).send(
    `
    <div style="
      width: 95vw; 
      height: 95vh; 
      display: flex; 
      justify-content: center; 
      align-items: center;
    ">
    <p style="
      padding: 10px;
      font-size: 2vmax; 
      border: 2px solid gray;
      background-color: lightgray;
      border-radius: 10px;
    ">
      Opa! parece que você está tentando acessar o backend do "Quer Apostar?" <br/>
      Se esse for o caso, leia o ReadMe do projeto em: <a href="https://github.com/Vinni088/Quer-Apostar"> Github: Quer apostar?</a> 
    </p>
  <div>
    `
  );
});

// Middleware de tratamento de erros
app.use(errorMiddleware);

export default app;