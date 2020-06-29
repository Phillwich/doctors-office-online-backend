import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";
import { Appointment } from "./Appointment";

@Entity()
export class Surgery {

  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  email: string;

  @Column()
  plz: string;

  @Column()
  city: string;

  @Column()
  phone: string;

  @Column()
  appointments: string[];
}