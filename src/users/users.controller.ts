import { Body, Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Crud } from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ObjectId } from 'typeorm';
import { AccessTokenGuard } from 'src/auth/strategy/accessToken.guard';


@Crud({
  model: {
    type: User,
  },
})
@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(public usersService: UsersService) { }
  
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // @UseGuards(AccessTokenGuard)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // } 
}



