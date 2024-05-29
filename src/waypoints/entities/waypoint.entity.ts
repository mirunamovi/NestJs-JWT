import { ApiProperty } from "@nestjs/swagger";
import { Track } from "src/tracks/entities/track.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from "typeorm";


@Entity({ name: 'waypoints' }) // Specify the collection name
export class Waypoint {

  @ApiProperty()
  @ObjectIdColumn({ name: "user", nullable: true })
  userId: User;

  @ApiProperty()
  @ObjectIdColumn({ name: "track", nullable: true }) // Define the primary key as an ObjectId
  trackId: ObjectId | Track;

  @ObjectIdColumn()
  waypointId: ObjectId;

  @ApiProperty()
  @Column()
  lat: number;

  @ApiProperty()
  @Column()
  lon: number;

  @ApiProperty()
  @Column()
  alt: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' }) 
  createdAt: Date;




}
