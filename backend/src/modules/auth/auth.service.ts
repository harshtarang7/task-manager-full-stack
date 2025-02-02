import { Repository } from "typeorm";
import { UserEntity, UserRole } from "../../data-models/user/user.entity";
import { sign, verify } from 'jsonwebtoken';
import dotenv  from 'dotenv';
import { compare, hash } from 'bcryptjs';
import { UserSignUpRequestDTO } from "./dto/user.sign.up.request";
import { UserLoginRequestDTO } from "./dto/user.login.request";
import { UserLoginResponseDTO } from "./dto/user.login.response";
dotenv.config();

export class AuthService{
    constructor(private readonly userRepository:Repository<UserEntity>){}

    private generateTokens(user:UserEntity){
        const accessToken = sign(
            {
                userId:user.id,
                role:user.role
            },
            process.env.JWT_SECRET!,
            {expiresIn:'15m'}           
        );

        const refreshToken = sign(
            { userId: user.id },  
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '1d' }
        );
        return { accessToken, refreshToken };
    }


    async verifyToken (token:string):Promise<{userId:number, role:UserRole}>{
        try {
            const decoded = verify(token,process.env.JWT_SECRET!) as {
                userId:number,
                role:UserRole,
            }

            if(!decoded){
                throw new Error('invalid token')
            }

            return decoded;
        } catch (error) {
            throw new Error('invalid token')
        }
    }

    async findUserById(id:number):Promise<UserEntity | null | undefined>{
        try {
            const user =  this.userRepository.findOne({
                where:{id}
            });

            if(!user){
                throw new Error("no user found with this ID");
            }

            return user;
        } catch (error) {
            throw new Error('error occured');            
        }
    }

    async signUp(dto:UserSignUpRequestDTO){
        try {
            const existingUser = await this.userRepository.findOne({
                where:{email:dto.email}
            });

            if(existingUser){
                throw new Error("user already exist with this email")
            }

            const hashedPass = await hash(dto.password,12);
            const user = this.userRepository.create({
                ...dto,
                password:hashedPass,
                role: UserRole.STAFF
            });

            await this.userRepository.save(user);
            const tokens = this.generateTokens(user);

            user.refresh_token = tokens.refreshToken;

            await this.userRepository.save(user);

            const {password, ...userWithoutPassword } = user;
            
            return { user: userWithoutPassword, ...tokens };
        } catch (error) {
            console.log(error)
            throw new Error('error occured')
        }
    }


    // login api

    async userLogin(email:string,password:string){
        try {
            const user = await this.userRepository.findOne({
                where:{email:email}
            });

            if(!user){
                throw new Error('user with this email not found')
            };

            const validPassword = await compare(password, user.password) 
            
            if(!validPassword){
                throw new Error('Password does not matched')
            }

            const token = this.generateTokens(user);

            user.refresh_token = token.refreshToken;
            await this.userRepository.save(user);

            const { password: _, ...userWithoutPassword } = user;
            return { user: userWithoutPassword, ...token };
        } catch (error) {
            throw error;
        }
    }

    async refreshToken(token: string) {
        const user = await this.userRepository.findOne({
          where: { refresh_token: token }
        });
    
        if (!user) {
          throw new Error('Invalid refresh token');
        }
    
        const tokens = this.generateTokens(user);
        
        user.refresh_token = tokens.refreshToken;
        await this.userRepository.save(user);
    
        // Exclude password from response
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, ...tokens };
      }
}

