import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { AuthJwt } from "../auth/jwt-auth.guard";
import { IResponse } from "../interfaces/api-interfaces";

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ) {
  }

  @ApiOperation({
    summary: 'Create user',
    description: 'SignUp user into the system.'
  })
  @ApiResponse({
    status: 200, description: 'Success-Response',
    schema: {
      example: {
        result: true,
        data: { id: '6160f5a9186609045c989652' }
      }
    }
  })
  @ApiResponse({
    status: 404, description: 'Error-Response',
    schema: {
      example: {
        'result': false,
        'message': 'Error message'
      }
    }
  })
  @ApiBody({
    description: 'Request example',
    schema: {
      example: {
        firstName: 'James',
        lastName: 'Doe',
        email: 'jdoe@example.com',
        password: '12345678',
        roles: ['user'],
      }
    }
  })
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthJwt)
  create(@Body() createDTO: CreateUserDto): Promise<IResponse> {
    return this.userService.create(createDTO);
  }

  @ApiOperation({
    summary: 'List all Users',
    description: 'Returns the list of all authenticated users.'
  })
  @ApiResponse({
    status: 200, description: 'Success-Response',
    schema: {
      example: {
        result: true,
        data: []
      }
    }
  })
  @ApiResponse({
    status: 404, description: 'Error-Response',
    schema: {
      example: {
        'result': false,
        'message': 'Error message'
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(AuthJwt)
  @Get()
  list(): Promise<IResponse> {
    return this.userService.list();
  }
}
