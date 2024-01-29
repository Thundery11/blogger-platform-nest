import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CatsService } from './cats.service';

@Controller('users')
export class UsersController {
  constructor(
    protected userService: UserService,
    protected catsService: CatsService,
  ) {}
  @Post('cats')
  addCat(@Body() createCatDto: inputModelCat) {
    return this.catsService.create(createCatDto);
  }
  @Get('cats')
  getCats() {
    return this.catsService.findAll();
  }
  @Get()
  getUsers(@Query() query: { term: string }) {
    return [
      { id: 1, name: 'Ilya' },
      { id: 2, name: 'Katya' },
    ].filter((u) => !query.term || u.name.indexOf(query.term) > -1);
  }
  @Post()
  createUSer(@Body() inputModel: CreateUserType) {
    return { id: 3, name: inputModel.name, children: inputModel.children };
  }
  @Get(':id')
  getUser(@Param('id') id: string) {
    return [{ id: 1 }, { id: 2 }].find((u) => u.id === +id);
  }
  @Delete(':id')
  deleteUser(@Param() id: string) {
    return;
  }
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() model: CreateUserType) {
    return {
      id: id,
      model: model,
    };
  }
}

type CreateUserType = {
  name: string;
  children: string;
};
type inputModelCat = {
  name: string;
  age: string;
  breed: string;
  tags: string[];
};
