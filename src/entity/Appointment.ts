import { Entity, ObjectID, ObjectIdColumn, Column, Timestamp } from "typeorm";

@Entity()
export class Appointment {

  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  date: string;

  @Column()
  description: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  userId: string

  @Column()
  surgeryId: string
  
}