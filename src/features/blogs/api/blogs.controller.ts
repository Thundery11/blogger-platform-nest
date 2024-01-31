import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogsService } from '../application/blogs.service';
@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(blogsService: BlogsService) {}
}
