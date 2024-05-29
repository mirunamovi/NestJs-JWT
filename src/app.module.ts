import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../typeorm.config';
import { UsersHttpModule } from './users/users-http.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TracksModule } from './tracks/tracks.module';
import { UsersModule } from './users/users.module';
import { TracksHttpModule } from './tracks/tracks-http.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { WaypointsModule } from './waypoints/waypoints.module';
import * as cors from 'cors';
import { FilesController } from './files/files.controller';
// import { FileUploadModule } from './file-upload/file-upload/file-upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ServeStaticModule.forRootAsync({
      useFactory: () => {
        const uploadsPath = join(__dirname, 'public/uploads');
        return [
          {
            rootPath: uploadsPath,
            serveRoot: '/public/uploads/',
          },
        ];
      },
    }),
    UsersHttpModule,
    TracksHttpModule,
    // FileUploadModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    },
    // CorsModule.forRoot({
    //   origin: 'http://localhost:8100', // Allow requests from this origin
    //   credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    // }),
  ),
    MongooseModule.forRoot(process.env.DB_URI),
    WaypointsModule,
    // TracksModule,
    // UsersModule
    
  ],
  controllers: [FilesController],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(cors({
  //     origin: 'http://localhost:8100', // Allow requests from this origin
  //     // origin: 'http://localhost', // Allow requests from this origin
  //     // origin: 'http://192.168.0.103', // Allow requests from this origin

  //     credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  //   })).forRoutes('*');
  // }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors({
        origin: '*', // Allow requests from this origin
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true, // Enable credentials (cookies, authorization headers, etc.)
      }))
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
