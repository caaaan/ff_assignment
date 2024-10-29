import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Player {
    
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: "text"
  })
  name: string;

  @Column({
    type: "text"
  })
  team: string;

  @Column({
    type: "text"
  })
  position: string;

  @Column({
    type: "int"
  })
  dribbleSkill: number;

  @Column({
    type: "int"
  })
  length: number;

  @Column({
    type: "int"
  })
  weight: number;

  @Column({
    type: "int"
  })
  age: number;

  @Column({
    type: "int"
  })
  ballControl: number;

  @Column({
    type: "int"
  })
  passingUnderPressure: number;
}
