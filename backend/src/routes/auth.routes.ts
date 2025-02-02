import { Router } from "express";
import { AuthController } from "../modules/auth/auth.controller";
import { authenticateToken, authorizeRoles } from "../middlerwares/auth.midleware";
import { UserRole } from "../data-models/user/user.entity";

const authRouter = Router();

authRouter.post('/sign-up',AuthController.signUp)
authRouter.post('/login',AuthController.login)
authRouter.post('/refresh-token',AuthController.refreshToken)


export default authRouter;