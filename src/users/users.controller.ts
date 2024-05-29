import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Req, UseGuards } from '@nestjs/common';
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
  constructor(public readonly usersService: UsersService) { }
  
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(email, updateUserDto);
  }

  @Get()
  async get(@Req() req): Promise<User> {
    const userId = req.user.sub; // Assuming req.user.sub holds the user ID
    const user = await this.usersService.findById(userId);
    return user;
  }




  // @UseGuards(AccessTokenGuard)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // } 
}



