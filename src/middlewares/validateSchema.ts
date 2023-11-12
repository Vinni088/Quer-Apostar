import { ObjectSchema } from 'joi';
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

export function validateSchema(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {

      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({
        explanation: "O objeto enviado está incorreto, por favor consulte a documentação"
      })
    }

    next();
  }
}