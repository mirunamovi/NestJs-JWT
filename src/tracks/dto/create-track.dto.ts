import { IsString, IsNotEmpty, IsDate, IsMongoId, IsEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsMongoId() 
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  // @IsNotEmpty()
  // @IsDate()
  // readonly date: Date;

  // @IsEmpty({message: "You cannot pass user Id."})
  // readonly user: User
}