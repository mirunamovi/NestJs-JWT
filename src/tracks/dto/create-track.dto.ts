import { IsString, IsNotEmpty, IsDate, IsMongoId, IsEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { ObjectId } from 'typeorm';

export class CreateTrackDto {

  id: ObjectId;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  fileName: string;


  // @IsNotEmpty()
  // @IsDate()
  // readonly date: Date;

  // @IsEmpty({message: "You cannot pass user Id."})
  // readonly user: User
}