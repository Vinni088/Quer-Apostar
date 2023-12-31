import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "../protocols/index.protocol"

export default function errorHandler(error: ApplicationError, req: Request, res: Response, next: NextFunction) {
    
    if (error.type === "valorBaixo") {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.message);
    } else if (error.type === "invalidId") {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.message);
    } else if (error.type === "conflict") {
        return res.status(httpStatus.CONFLICT).send(error.message);
    } else if (error.type === "notFound") {
        return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    console.log(error)
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Sorry, something went wrong 😢");
}