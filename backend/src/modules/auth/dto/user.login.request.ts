import {IsNotEmpty} from 'class-validator'

export class UserLoginRequestDTO{
   
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    password:string;

}