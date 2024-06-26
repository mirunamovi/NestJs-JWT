import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../typeorm.config';
import { UsersHttpModule } from './users/users-http.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TracksHttpModule } from './tracks/tracks-http.module';
import * as cors from 'cors';
import { FilesController } from './files/files.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Relative to compiled files in dist
      serveRoot: '/uploads',
    }),
    UsersHttpModule,
    TracksHttpModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    },
  ),
    ForgotPasswordModule,    
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
    }),
    
  ],
  controllers: [FilesController],
})
export class AppModule {
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
