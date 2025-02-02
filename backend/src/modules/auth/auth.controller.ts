import { Request, Response } from 'express';
import { DBSource } from "../../config/db.config";
import { UserEntity } from "../../data-models/user/user.entity";
import { AuthService } from "./auth.service";
import { UserLoginRequestDTO } from './dto/user.login.request';

const authService = new AuthService(DBSource.getRepository(UserEntity));

export class AuthController{
    static async signUp(req:Request,res:Response){
        try {
            const result = await authService.signUp(req.body);
            
            if(!result){
                throw new Error('fields required')
            }

            res.json(result)
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
          const result = await authService.userLogin(email, password);
          res.json(result);
        } catch (error: any) {
          res.status(401).json({ message: error.message });
        }
      }

      static async refreshToken(req: Request, res: Response) {
        try {
          const { token } = req.body;
          const result = await authService.refreshToken(token);
          res.json(result);
        } catch (error: any) {
          res.status(401).json({ message: error.message });
        }
      }
}