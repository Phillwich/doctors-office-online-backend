import { Entity, ObjectID, ObjectIdColumn, Column, Timestamp } from "typeorm";

@Entity()
export class Appointment {

  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  date: Date;

  @Column()
  description: string;

  @Column()
  userId: string

  @Column()
  surgeryId: string
  
}