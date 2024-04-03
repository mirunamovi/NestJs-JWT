import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Track } from 'src/tracks/entities/track.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: 'mongodb+srv://mirunamovi:iHr3rcbWuwQlLL0D@cluster0.7wlbiro.mongodb.net/Tracking?retryWrites=true&w=majority&appName=Cluster0',
  useNewUrlParser: true,
  port: 27017, 
  useUnifiedTopology: true,
  entities: [User, Track], // Assuming your entities are in a directory called 'entities'
  synchronize: true,
  autoLoadEntities: true,


};
