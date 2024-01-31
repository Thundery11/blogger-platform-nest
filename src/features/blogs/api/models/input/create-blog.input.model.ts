import { IsString, Length, Matches, MaxLength } from 'class-validator';
import { Trim } from 'src/infrastucture/decorators/transform/trim';

export class BlogsCreateModel {
  @Trim()
  @IsString()
  @MaxLength(15, { message: 'Length not correct' })
  name: string;

  @Trim()
  @IsString()
  @MaxLength(500, { message: 'Length not correct' })
  description: string;

  @Trim()
  @IsString()
  @MaxLength(15, { message: 'Length not correct' })
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}
