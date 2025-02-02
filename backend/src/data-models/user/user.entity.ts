import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    STAFF = 'staff',
    TEAM_LEADER = 'team_leader'
}
  
@Entity({name:'users'})
@Unique(['email'])
export class UserEntity{
    @PrimaryGeneratedColumn({type:'int'})
    id:number;

    @Column({type:'varchar', length:150,nullable:false,name:'first_name'})
    first_name: string;

    @Column({type:'varchar', length:100,nullable:false,name:'last_name'})
    last_name: string;

    @Column({type:'varchar',unique: true , length:250,nullable:false,name:'email'})
    email: string;

    @Column({type:'varchar', length:255,nullable:false,name:'password'})
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.STAFF
      })
      role: UserRole;

      @Column({name:'refresh_token', type:'varchar'})
      refresh_token:string;

      @Column({name:'created_at', type:'date', default:()=>'CURRENT_TIMESTAMP'})
      created_at:string;

      @Column({name:'updated_at', type:'date', default:()=>'CURRENT_TIMESTAMP'})
      updated_at:string;
}