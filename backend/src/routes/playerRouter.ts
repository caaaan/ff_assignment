import { Router, Application } from 'express';
import { playerController } from '../controllers/playerController';
//import { authController } from '../controllers/authController';
import { createValidator, updateValidator, deleteValidator } from '../validators/playerValidator';
//import { loginValidator, registerValidator } from '../validators/authValidator';
export const playerRouter = Router();

//playerRouter.post('/login',loginValidator, <Application> authController.login);
//playerRouter.post('/register',registerValidator, <Application> authController.register);
playerRouter.get('/players',  <Application> playerController.getAll);
playerRouter.post('/player/create', createValidator, <Application> playerController.create);
playerRouter.put('/player/update', updateValidator, <Application> playerController.update);
playerRouter.delete('/player/delete',  deleteValidator, <Application> playerController.delete);



