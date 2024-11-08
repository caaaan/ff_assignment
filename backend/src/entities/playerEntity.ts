import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'assignment_data' })
export class Player {
    
  @PrimaryColumn({
    type: "text",
    unique: true,
  })
  player?: string;

  @Column({
    type: "text",
    nullable: true,
  })
  team?: string;

  @Column({
    type: "text",
    nullable: true,
  })
  position?: string;

  @Column({
    name: "Dribble Skills",
    type: "double precision",
    nullable: true,
  })
  dribbleSkills?: number;

  @Column({
    type: "double precision",
    nullable: true,
  })
  length?: number;

  @Column({
    type: "double precision",
    nullable: true,
  })
  weight?: number;

  @Column({
    type: "double precision",
    nullable: true,
  })
  age?: number;

  @Column({
    name: "Ball Control",
    type: "double precision",
    nullable: true,
  })
  ballControl?: number;

  @Column({
    name: "Passing Under Pressure",
    type: "double precision",
    nullable: true,
  })
  passingUnderPressure?: number;
}