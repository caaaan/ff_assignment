import { Entity, Column, PrimaryColumn} from 'typeorm';

@Entity({ name: 'users' })
export class User {

    @PrimaryColumn({ unique: true, nullable: false })
    username: string;

    @Column({nullable: false })
    password: string; // Store hashed password
}
