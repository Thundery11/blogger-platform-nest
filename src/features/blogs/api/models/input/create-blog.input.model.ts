import { IsString, Matches, MaxLength } from 'class-validator';
import { Trim } from '../../../../../infrastucture/decorators/transform/trim';

export class BlogsCreateModel {
  @Trim()
  @IsString()
  @MaxLength(15)
  name: string;

  @Trim()
  @IsString()
  @MaxLength(500)
  description: string;

  @Trim()
  @IsString()
  @MaxLength(100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}
