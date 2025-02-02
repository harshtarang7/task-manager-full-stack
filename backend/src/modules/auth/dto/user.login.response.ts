import { UserEntity } from "../../../data-models/user/user.entity";

export class UserLoginResponseDTO extends UserEntity{
    token:string
}