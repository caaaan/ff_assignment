import { Router } from "express";
import { playerController } from "../controllers/playerController";
import { createValidator, updateValidator } from "../validators/playerValidator";

export const playerRouter: Router = Router();

playerRouter.get('/players',playerController.getAll);

playerRouter.post('/player/create', createValidator, playerController.create);

playerRouter.put('/player/update', updateValidator, playerController.update);

