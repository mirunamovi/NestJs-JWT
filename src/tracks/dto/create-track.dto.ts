import { IsString, IsNotEmpty, IsDate, IsMongoId, IsEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly url: string;


  // @IsNotEmpty()
  // @IsDate()
  // readonly date: Date;

  // @IsEmpty({message: "You cannot pass user Id."})
  // readonly user: User
}