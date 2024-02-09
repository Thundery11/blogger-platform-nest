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

export class PostCreateModelWithBlogId {
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

  @Trim()
  @IsString()
  blogId: string;
}

export class PostUpdateModel {
  @Trim()
  @IsString()
  @MaxLength(30)
  title: string;

  @Trim()
  @IsString()
  @MaxLength(100)
  shortDescription: string;

  @Trim()
  @IsString()
  @MaxLength(1000)
  content: string;

  @Trim()
  @IsString()
  blogId: string;
}
