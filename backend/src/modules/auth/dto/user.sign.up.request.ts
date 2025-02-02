import {IsNotEmpty, IsOptional} from 'class-validator'
import { UserRole } from '../../../data-models/user/user.entity';

export class UserSignUpRequestDTO{
    @IsNotEmpty()
    first_name:string;

    @IsNotEmpty()
    last_name:string;

    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    password:string;
}

export class AdminSignUpInput extends UserSignUpRequestDTO{
    role:UserRole;
}