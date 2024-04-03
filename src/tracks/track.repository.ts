import { Repository } from "typeorm";
import { Track } from "./entities/track.entity";

export class TrackRepository extends Repository<Track>{}

