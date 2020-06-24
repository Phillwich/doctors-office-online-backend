import { Entity, ObjectID, ObjectIdColumn, Column, Timestamp } from "typeorm";
import { User } from "./User";

export class Appointment {

  @Column()
  date: string;

  @Column()
  description: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column(type => User)
  user: User;

  constructor(date: string, description: string, startTime: string, endTime: string, user: User) {
    this.date = date;
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
    this.user = user;
  }
}