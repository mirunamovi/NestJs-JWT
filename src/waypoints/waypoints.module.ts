import { Module } from '@nestjs/common';
import { WaypointsService } from './waypoints.service';
import { WaypointsController } from './waypoints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Waypoint } from './entities/waypoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Waypoint])],
  controllers: [WaypointsController],
  providers: [WaypointsService],
})
export class WaypointsModule {}
