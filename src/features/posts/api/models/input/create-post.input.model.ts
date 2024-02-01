import { IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../../../infrastucture/decorators/transform/trim';

export class PostCreateModel {
  @Trim()
  @IsString()
  @MaxLength(30, { message: 'Length not correct' })
  title: string;

  @Trim()
  @IsString()
  @MaxLength(100, { message: 'Length not correct' })
  shortDescription: string;

  @Trim()
  @IsString()
  @MaxLength(1000, { message: 'Length not correct' })
  content: string;
}
