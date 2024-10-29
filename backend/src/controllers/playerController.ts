import { AppDataSource } from "..";
import { Player } from "../entities/playerEntity";
import {instanceToPlain, plainToInstance} from "class-transformer";
import {Request, Response } from "express";
import { validationResult } from "express-validator";
import { UpdateResult } from "typeorm";

export class PlayerController {

    public async getAll(req: Request, res:Response): Promise<Response>{
        let allPlayers: Player[]=[];
        try{
            allPlayers = await AppDataSource.getRepository(Player).find({
                order:{
                    name: "ASC",
                }
            });
            allPlayers = instanceToPlain(allPlayers) as Player[];
            return res.json(allPlayers).status(200);
        } catch (_errors) {
            return res.json({error: "internal Server Error"}).status(500);
        }
    } 

    public async create(req:Request,res: Response): Promise<Response>{
        const errors = validationResult(req);
        if(!errors.isEmpty){
            return res.json({errors: errors.array}).status(400);
        }
        const player = new Player();

        player.name = req.body.name;
        player.team = req.body.team;
        player.position = req.body.position;
        player.dribbleSkill = req.body.dribbleSkill;
        player.length = req.body.length;
        player.weight = req.body.weight;
        player.age = req.body.age;
        player.ballControl = req.body.ballControl;
        player.passingUnderPressure = req.body.passingUnderPressure;

        let createdPlayer: Player;

        try{
            createdPlayer = await AppDataSource.getRepository(Player).save(player);
            createdPlayer = instanceToPlain(createdPlayer) as Player;
            return res.json(createdPlayer).status(201);
        }catch (error){
            return res.json({error: "internal Server Error"}).status(500);
        }
        
    }
    public async update(
        req: Request,
        res: Response,
      ): Promise<Response> {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ errors: errors.array() });
        }
    
        // Try to find if the player exists
        let player: Player | null;
    
        try {
          player = await AppDataSource.getRepository(
            Player,
          ).findOne({
            where: { id: req.body.id },
          });
        } catch (errors) {
          return res
            .json({ error: 'Internal Server Error' })
            .status(500);
        }
    
        // Return 400 if player is null
        if (!player) {
          return res.status(404).json({
            error: 'The player with given ID does not exist',
          });
        }
    
        // Declare a variable for updatedPlayer
        let updatedPlayer: UpdateResult;
    
        // Update the player
        try {
          updatedPlayer = await AppDataSource.getRepository(
            Player,
          ).update(
            req.body.id,
            plainToInstance(Player, {
              team: req.body.team,
            }),
          );
    
          // Convert the updatedPlayer instance to an object
          updatedPlayer = instanceToPlain(
            updatedPlayer,
          ) as UpdateResult;
    
          return res.json(updatedPlayer).status(200);
        } catch (errors) {
          return res
            .json({ error: 'Internal Server Error' })
            .status(500);
        }
      }
}

export const playerController = new PlayerController();

