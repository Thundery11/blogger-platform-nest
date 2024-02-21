import { IsEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Trim } from '../../../../../infrastucture/decorators/transform/trim';

export class BlogsCreateModel {
  @Trim()
  @IsString()
  @IsEmpty()
  @MaxLength(15)
  name: string;

  @Trim()
  @IsString()
  @IsEmpty()
  @MaxLength(500)
  description: string;

  @Trim()
  @IsString()
  @IsEmpty()
  @MaxLength(100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}
