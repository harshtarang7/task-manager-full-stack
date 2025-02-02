import {Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';
import { UserRole } from "../data-models/user/user.entity";


export interface AuthRequest extends Request{
    user?:{
        userId: number;
        role:UserRole;
    };
}

export const authenticateToken = (req:AuthRequest, res:Response, next:NextFunction)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if(!token){
        return res.status(401).json({message:'Authentication Required!'});
    }
    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as {
            userId: number;  
            role: UserRole;
          };
          req.user = decoded;

          next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export const authorizeRoles = (roles:UserRole[])=>{
    return(req:AuthRequest, res:Response, next:NextFunction)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({message:'Access denied'});
        }
        next();
    };
};

