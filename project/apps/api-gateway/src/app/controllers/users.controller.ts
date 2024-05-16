import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { Body, Controller, Get, HttpStatus, Inject, Param, Patch, Post, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ServicesURLs } from '../types/services-urls';

import { AxiosExceptionFilter } from '../filters/axios-exception.filter';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { InjectUserIdInterceptor } from '@project/interceprots'
import { apiGatewayConfig } from '@project/api-gateway-config';

import { ChangePasswordDTO, CreateUserDTO, LoginUserDTO, UserRDO } from '@project/user/blog-user';
import { AuthenticationMessage } from '@project/user/authentication'
import { TokenPayloadInterface } from '@project/shared/core';
import { BlogUserMessage } from 'libs/user/blog-user/src/lib/blog-user.constant';

@ApiTags('Api-gateway: Users')
@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  public servicesURLs: ServicesURLs;

  constructor(
    private readonly httpService: HttpService,

    @Inject(apiGatewayConfig.KEY)
    private readonly config: ConfigType<typeof apiGatewayConfig>
  ) {
    this.servicesURLs = {
      auth: this.config.authenticationServiceURL,
      users: this.config.userServiceURL,
      posts: this.config.postServiceURL,
    }
  }

  @Post('register')
  @ApiResponse({
    type: UserRDO,
    status: HttpStatus.CREATED,
    description: AuthenticationMessage.SUCCESS.CREATED
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: AuthenticationMessage.ERROR.ALREADY_EXISTS
  })
  public async create(@Body() registerUserDto: CreateUserDTO) {
    const serviceUrl = `${this.servicesURLs.auth}/register`;

    const { data } = await this.httpService.axiosRef.post(serviceUrl, registerUserDto);

    return data;
  }

  @Post('login')
  @ApiResponse({
    type: UserRDO,
    status: HttpStatus.OK,
    description: AuthenticationMessage.SUCCESS.LOGGED_IN
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationMessage.ERROR.INCORRECT_CREDENTIALS
  })
  public async login(@Body() loginUserDto: LoginUserDTO) {
    const serviceUrl = `${this.servicesURLs.auth}/login`;

    const { data } = await this.httpService.axiosRef.post(serviceUrl, loginUserDto);
    return data;
  }

  @Patch('password')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiResponse({
    type: UserRDO,
    status: HttpStatus.OK,
    description: AuthenticationMessage.SUCCESS.LOGGED_IN
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationMessage.ERROR.INCORRECT_CREDENTIALS
  })
  public async changePassword(@Body() dto: ChangePasswordDTO & TokenPayloadInterface) {
    const serviceUrl = `${this.servicesURLs.users}/${dto.userId}/password`;

    const { data } = await this.httpService.axiosRef.patch(`${serviceUrl}`, dto);

    return data;
  }

  @Post('refresh')
  @ApiResponse({
    type: UserRDO,
    status: HttpStatus.OK,
    description: AuthenticationMessage.SUCCESS.NEW_TOKENS
  })
  @ApiResponse({
    type: UserRDO,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: AuthenticationMessage.SUCCESS.CANT_CREATE_TOKENS
  })
  public async refreshToken(@Req() req: Request) {
    const serviceUrl = `${this.servicesURLs.auth}/refresh`;

    const { data } = await this.httpService.axiosRef.post(serviceUrl, null, {
      headers: {
        'Authorization': req.headers['authorization']
      }
    });

    return data;
  }

  @Post('detail')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: BlogUserMessage.DESCRIPTION.USER_DETAIL })
  @ApiResponse({
    type: UserRDO,
    status: HttpStatus.OK,
    description: BlogUserMessage.SUCCESS.FOUND
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogUserMessage.ERROR.NOT_FOUND
  })
  public async gerUserDetail(@Body('userId') userId: string) {
    const userServiceUrl = `${this.servicesURLs.users}/`;
    const postServiceUrl = `${this.servicesURLs.posts}/count`;

    const { data: userData } = await this.httpService.axiosRef.post(userServiceUrl, { userId });

    const { data: userPostsCount } = await this.httpService.axiosRef.post(postServiceUrl, { userId });

    return { ...userData, userPostsCount: userPostsCount };
  }

  // Subscriptions
  @Get('subscribers')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: BlogUserMessage.DESCRIPTION.USER_SUBSCRIBERS })
  @ApiResponse({
    type: UserRDO,
    status: HttpStatus.OK,
    description: BlogUserMessage.SUCCESS.FOUND
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogUserMessage.ERROR.INCORRECT_CREDENTIALS
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogUserMessage.ERROR.NOT_FOUND
  })
  public async getSubscribers( @Body('userId') userId: string ) {
    const userServiceUrl = `${this.servicesURLs.users}/${userId}/subscribers`;
    const { data } = await this.httpService.axiosRef.get(userServiceUrl);

    return data;
  }

  @Post('/subscribe/:targetUserId')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: BlogUserMessage.DESCRIPTION.SUBSCRIBE })
  @ApiResponse({
    type: UserRDO,
    status: HttpStatus.CREATED,
    description: BlogUserMessage.SUCCESS.UPDATED
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogUserMessage.ERROR.INCORRECT_CREDENTIALS
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogUserMessage.ERROR.NOT_FOUND
  })
  public async subscribe(
    @Param('targetUserId') targetUserId: string,
    @Body('userId') userId: string,
  ) {
    const userServiceUrl = `${this.servicesURLs.users}/${userId}/subscribe/${targetUserId}`;
    const { data } = await this.httpService.axiosRef.post(userServiceUrl);

    return data;
  }

  @Post('/unsubscribe/:targetUserId')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: BlogUserMessage.DESCRIPTION.SUBSCRIBE })
  @ApiResponse({
    type: UserRDO,
    status: HttpStatus.CREATED,
    description: BlogUserMessage.SUCCESS.UPDATED
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogUserMessage.ERROR.INCORRECT_CREDENTIALS
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogUserMessage.ERROR.NOT_FOUND
  })
  public async unsubscribe(
    @Param('targetUserId') targetUserId: string,
    @Body('userId') userId: string,
  ) {
    const userServiceUrl = `${this.servicesURLs.users}/${userId}/unsubscribe/${targetUserId}`;
    const { data } = await this.httpService.axiosRef.post(userServiceUrl);

    return data;
  }
}
