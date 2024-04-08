import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WaypointsService } from './waypoints.service';
import { CreateWaypointDto } from './dto/create-waypoint.dto';
import { UpdateWaypointDto } from './dto/update-waypoint.dto';

@Controller('waypoints')
export class WaypointsController {
  constructor(private readonly waypointsService: WaypointsService) {}

  @Post()
  create(@Body() createWaypointDto: CreateWaypointDto) {
    return this.waypointsService.create(createWaypointDto);
  }

  @Get()
  findAll() {
    return this.waypointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waypointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaypointDto: UpdateWaypointDto) {
    return this.waypointsService.update(+id, updateWaypointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waypointsService.remove(+id);
  }
}
