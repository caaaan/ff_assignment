import { Router, Application } from "express";
import { playerController } from "../controllers/playerController";
import { createValidator, updateValidator } from "../validators/playerValidator";

export const playerRouter: Router = Router();

playerRouter.get('/players', <Application>  playerController.getAll);

playerRouter.post('/player/create', createValidator, <Application> playerController.create);

playerRouter.put('/player/update', updateValidator, <Application>  playerController.update);

