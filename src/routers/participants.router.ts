import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema';
import { createUserSchema } from "../schemas/post.schemas"
import * as participantsController from "../controllers/participants.controller"

const participantsRouter = Router();

participantsRouter.get('/participants', participantsController.participantGet);

participantsRouter.post('/participants', validateSchema(createUserSchema) ,  participantsController.participantPost);

export { participantsRouter };
