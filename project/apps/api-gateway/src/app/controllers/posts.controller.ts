import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Query, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AxiosExceptionFilter } from '../filters/axios-exception.filter';

import { apiGatewayConfig } from '@project/api-gateway-config';
import { ConfigType } from '@nestjs/config';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { InjectUserIdInterceptor } from '@project/interceprots';

import { SortDirection, SortType, TokenPayloadInterface } from '@project/shared/core';

import { BlogPostMessage } from '@project/blog-post';
import { BasePostWithPaginationRDO } from 'libs/post/blog-post/src/lib/rdo/base-post-with-pagination.rdo';
import { GetPostsListQuery } from 'libs/post/blog-post/src/lib/types/queries/get-posts-list.query';
import { ServicesURLs } from '../types/services-urls';
import { SearchPostsQuery } from 'libs/post/blog-post/src/lib/types/queries/search-posts.query';
import { BasePostWithExtraFieldsRDO } from 'libs/post/blog-post/src/lib/rdo/base-post-with-extra-fields';
import { CreateBasePostDTO } from 'libs/post/blog-post/src/lib/dto/create-base-post.dto';
import { CreateRepostDTO } from 'libs/post/blog-post/src/lib/dto/create-repost.dto';
import { UpdateBasePostDTO } from 'libs/post/blog-post/src/lib/dto/update-base-post.dto';

import { CommentMessage } from '@project/post/comment';
import { CreateCommentRDO } from 'libs/post/comment/src/lib/rdo/create-comment.rdo';
import { CreateCommentDTO } from 'libs/post/comment/src/lib/dto/create-comment.dto';

import { CommentQuery } from 'libs/post/comment/src/lib/dto/comment.query';

const ApiGatewayURL = {
  USER_DETAIL: 'http://127.0.0.1:11000/api/users/detail'
} as const;
@ApiTags('Api-gateway: posts')
@Controller('posts')
@UseFilters(AxiosExceptionFilter)
export class PostsController {
  public servicesURLs: ServicesURLs;

  constructor(
    private readonly httpService: HttpService,

    @Inject(apiGatewayConfig.KEY)
    private readonly config: ConfigType<typeof apiGatewayConfig>
  ){
    this.servicesURLs = {
      auth: this.config.authenticationServiceURL,
      users: this.config.userServiceURL,
      posts: this.config.postServiceURL,
      comments: this.config.commentServiceURL,
      tags: this.config.tagServiceURL,
    }
  }

  // Posts
  @Get('/')
  @ApiOperation({ summary: BlogPostMessage.DESCRIPTION.LIST })
  @ApiQuery({
    name: "tag",
    description: BlogPostMessage.DESCRIPTION.POST_TAG,
    example: "/?tag=headline",
    required: false
  })
  @ApiQuery({
    name: "authorId",
    description: BlogPostMessage.DESCRIPTION.AUTHOR_ID,
    example: "/?authorId=66224f68a3f9a165a1ab5fbd",
    required: false
  })
  @ApiQuery({
    name: "limit",
    description: `${BlogPostMessage.DESCRIPTION.LIMIT}. ${BlogPostMessage.DESCRIPTION.DEFAULT_POSTS_LIST_LIMIT}`,
    example: "/?limit=10",
    required: false
  })
  @ApiQuery({
    name: "page",
    description: `${BlogPostMessage.DESCRIPTION.PAGE}. ${BlogPostMessage.DESCRIPTION.DEFAULT_PAGE}`,
    example: "/?page=1",
    required: false
  })
  @ApiQuery({
    name: "sortType",
    description: `${BlogPostMessage.DESCRIPTION.SORT_TYPE}. ${BlogPostMessage.DESCRIPTION.DEFAULT_SORT_TYPE}`,
    enum: SortType,
    example: "/?sortType=createdAt",
    required: false
  })
  @ApiQuery({
    name: "sortDirection",
    description: `${BlogPostMessage.DESCRIPTION.SORT_DIRECTION}. ${BlogPostMessage.DESCRIPTION.DEFAULT_SORT_DIRECTION}`,
    enum: SortDirection,
    example: "/?sortDirection=desc",
    required: false
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: BlogPostMessage.SUCCESS.FOUND,
    type: BasePostWithPaginationRDO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostMessage.ERROR.NOT_FOUND
  })
  public async index(@Query() query: GetPostsListQuery) {
    const serviceUrl = `${this.servicesURLs.posts}/`;
    const { data } = await this.httpService.axiosRef.get(serviceUrl, { params: query });

    return data;
  }

  @Post('/')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: BlogPostMessage.DESCRIPTION.CREATE })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: BlogPostMessage.SUCCESS.CREATED,
    type: BasePostWithExtraFieldsRDO
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogPostMessage.ERROR.UNAUTHORIZED
  })
  @ApiBody({
    type: CreateBasePostDTO,
    required: true
  })
  public async create(@Body() dto: CreateBasePostDTO & TokenPayloadInterface) {
    const serviceUrl = `${this.servicesURLs.posts}/`;
    const createPostData = { ...dto, authorId: dto.userId }; // Подставляем в качестве автора поста текущего юзера
    const { data } = await this.httpService.axiosRef.post(serviceUrl, createPostData);

    return data;
  }

  @Get('drafts')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: BlogPostMessage.DESCRIPTION.DRAFTS })
  @ApiQuery({
    name: "tag",
    description: BlogPostMessage.DESCRIPTION.POST_TAG,
    example: "/?tag=headline",
    required: false
  })
  @ApiQuery({
    name: "authorId",
    description: BlogPostMessage.DESCRIPTION.AUTHOR_ID,
    example: "/?authorId=66224f68a3f9a165a1ab5fbd",
    required: false
  })
  @ApiQuery({
    name: "limit",
    description: `${BlogPostMessage.DESCRIPTION.LIMIT}. ${BlogPostMessage.DESCRIPTION.DEFAULT_POSTS_LIST_LIMIT}`,
    example: "/?limit=10",
    required: false
  })
  @ApiQuery({
    name: "page",
    description: `${BlogPostMessage.DESCRIPTION.PAGE}. ${BlogPostMessage.DESCRIPTION.DEFAULT_PAGE}`,
    example: "/?page=1",
    required: false
  })
  @ApiQuery({
    name: "sortType",
    description: `${BlogPostMessage.DESCRIPTION.SORT_TYPE}. ${BlogPostMessage.DESCRIPTION.DEFAULT_SORT_TYPE}`,
    enum: SortType,
    example: "/?sortType=createdAt",
    required: false
  })
  @ApiQuery({
    name: "sortDirection",
    description: `${BlogPostMessage.DESCRIPTION.SORT_DIRECTION}. ${BlogPostMessage.DESCRIPTION.DEFAULT_SORT_DIRECTION}`,
    enum: SortDirection,
    example: "/?sortDirection=desc",
    required: false
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: BlogPostMessage.SUCCESS.FOUND,
    type: BasePostWithPaginationRDO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostMessage.ERROR.NOT_FOUND
  })
  public async getUserDrafts(@Query() query: GetPostsListQuery, @Body('userId') userId: string) {
    const serviceUrl = `${this.servicesURLs.posts}/drafts`;
    const quryParams = { ...query, authorId: userId };
    const { data } = await this.httpService.axiosRef.get(serviceUrl, { params: quryParams });

    return data;
  }

  // User posts feed
  @Get('feed')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: 'Get user posts feed' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: BlogPostMessage.SUCCESS.FOUND,
    type: BasePostWithPaginationRDO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostMessage.ERROR.NOT_FOUND
  })
  public async getUserFeed(
    @Body('userId') userId: string,
    @Req() req: Request
  ) {
    const userServiceUrl = ApiGatewayURL.USER_DETAIL;

    const { data: userDetails } = await this.httpService.axiosRef.post(userServiceUrl, { data: { userId } }, {
      headers: {
        'Authorization': req.headers['authorization']
      }
    });

    const authorsIds = [ userDetails.id, ...userDetails.subscriptions ];
    const userPostsFeed = await this.index({ authorsIds });

    return userPostsFeed;
  }

  // Поиск по заголовку (ТЗ п.8)
  @Get('search')
  @ApiOperation({ summary: BlogPostMessage.DESCRIPTION.SEARCH })
  @ApiQuery({
    name: "title",
    description: BlogPostMessage.DESCRIPTION.POST_TITLE,
    example: "/?title=headline",
    required: false
  })
  @ApiQuery({
    name: "limit",
    description: `${BlogPostMessage.DESCRIPTION.LIMIT}. ${BlogPostMessage.DESCRIPTION.DEFAULT_LIMIT}`,
    example: "/?limit=10",
    required: false
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: BlogPostMessage.SUCCESS.FOUND,
    type: BasePostWithPaginationRDO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostMessage.ERROR.NOT_FOUND
  })
  public async search(@Query() query: SearchPostsQuery) {
    const serviceUrl = `${this.servicesURLs.posts}/search`;
    const { data } = await this.httpService.axiosRef.get(serviceUrl, { params: query });

    return data;
  }

  @Get(':postId')
  @ApiOperation({ summary: BlogPostMessage.DESCRIPTION.SHOW })
  @ApiResponse({
    status: HttpStatus.OK,
    description: BlogPostMessage.SUCCESS.FOUND,
    type: BasePostWithExtraFieldsRDO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostMessage.ERROR.NOT_FOUND
  })
  @ApiParam({
    name: "postId",
    example: 'b0103f3e-a6ac-4719-94bc-60c8294c08c6',
    description: BlogPostMessage.DESCRIPTION.POST_ID,
    required: true
  })
  public async getDetail(@Param('postId') postId: string) {
    const serviceUrl = `${this.servicesURLs.posts}/${postId}`;
    const { data } = await this.httpService.axiosRef.get(serviceUrl);

    return data;
  }

  @Patch(':postId')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: BlogPostMessage.DESCRIPTION.UPDATE })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: BlogPostMessage.SUCCESS.UPDATED,
    type: BasePostWithExtraFieldsRDO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostMessage.ERROR.NOT_FOUND
  })
  @ApiParam({
    name: "postId",
    example: 'b0103f3e-a6ac-4719-94bc-60c8294c08c6',
    description: BlogPostMessage.DESCRIPTION.POST_ID,
    required: true
  })
  @ApiBody({
    type: UpdateBasePostDTO
  })
  public async update(
    @Param('postId') postId: string,
    @Body() updatedFields: UpdateBasePostDTO & TokenPayloadInterface
  ) {
    const serviceUrl = `${this.servicesURLs.posts}/${postId}/`;
    const { data } = await this.httpService.axiosRef.patch(serviceUrl, updatedFields);

    return data;
  }

  @Delete(':postId')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: BlogPostMessage.DESCRIPTION.DELETE })
  @ApiParam({
    name: "postId",
    example: 'b0103f3e-a6ac-4719-94bc-60c8294c08c6',
    description: BlogPostMessage.DESCRIPTION.POST_ID,
    required: true
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: BlogPostMessage.SUCCESS.DELETED
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogPostMessage.ERROR.NOT_FOUND
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param('postId') postId: string,
    @Body('userId') userId: string
  ) {
    const serviceUrl = `${this.servicesURLs.posts}/${postId}/`;
    const { data } = await this.httpService.axiosRef.delete(serviceUrl, { data: { userId } });
    console.log('SERVICE URL: ', serviceUrl)

    return data;
  }

  @Post('/:postId/repost/')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: BlogPostMessage.DESCRIPTION.REPOST })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: BlogPostMessage.SUCCESS.CREATED,
    type: BasePostWithExtraFieldsRDO
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogPostMessage.ERROR.UNAUTHORIZED
  })
  @ApiBody({
    type: CreateRepostDTO,
    required: true
  })
  public async repost(
    @Param('postId') postId: string,
    @Body('userId') userId: string
  ) {
    const serviceUrl = `${this.servicesURLs.posts}/${postId}/repost`;
    const { data } = await this.httpService.axiosRef.post(serviceUrl, { authorId: userId });

    return data;
  }

  // Comments
  @Post(':postId/comments')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: CommentMessage.DESCRIPTION.CREATE })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: CommentMessage.SUCCESS.CREATED,
    type: CreateCommentRDO
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CommentMessage.ERROR.UNAUTHORIZED
  })
  @ApiParam({
    name: "postId",
    example: 'b0103f3e-a6ac-4719-94bc-60c8294c08c6',
    description: CommentMessage.DESCRIPTION.POST_ID,
    required: true
  })
  @ApiBody({
    type: CreateCommentDTO,
    required: true
  })
  public async addComment(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDTO & TokenPayloadInterface
  ) {
    const serviceUrl = `${this.servicesURLs.comments}/posts/${postId}/comments`;
    const { data } = await this.httpService.axiosRef.post(serviceUrl, { ...dto, authorId: dto.userId });

    return data;
  }

  @Get(':postId/comments')
  @ApiOperation({ summary: CommentMessage.DESCRIPTION.INDEX })
  @ApiResponse({
    status: HttpStatus.OK,
    description: CommentMessage.SUCCESS.FOUND,
    type: CreateCommentRDO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CommentMessage.ERROR.NOT_FOUND
  })
  @ApiParam({
    name: "postId",
    example: 'b0103f3e-a6ac-4719-94bc-60c8294c08c6',
    description: CommentMessage.DESCRIPTION.POST_ID,
    required: true
  })
  @ApiQuery({
    name: "limit",
    description: `${CommentMessage.DESCRIPTION.LIMIT}. ${CommentMessage.DESCRIPTION.DEFAULT_LIMIT}`,
    example: "/?limit=10",
    required: false
  })
  @ApiQuery({
    name: "page",
    description: `${CommentMessage.DESCRIPTION.PAGE}. ${CommentMessage.DESCRIPTION.DEFAULT_PAGE}`,
    example: "/?page=1",
    required: false
  })
  public async getPaginatedComments(
    @Param('postId') postId: string,
    @Query() query: CommentQuery
  ) {
    const serviceUrl = `${this.servicesURLs.comments}/posts/${postId}/comments`;
    const { data } = await this.httpService.axiosRef.get(serviceUrl, { params: query });

    return data;
  }

  @Delete(':postId/comments/:commentId')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiOperation({ summary: CommentMessage.DESCRIPTION.DELETE })
  @ApiParam({
    name: "postId",
    example: 'b0103f3e-a6ac-4719-94bc-60c8294c08c6',
    description: CommentMessage.DESCRIPTION.POST_ID,
    required: true
  })
  @ApiParam({
    name: "commentId",
    example: 'b0103f3e-a6ac-4719-94bc-60c8294c08c6',
    description: CommentMessage.DESCRIPTION.POST_ID,
    required: true
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: CommentMessage.SUCCESS.DELETED
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CommentMessage.ERROR.NOT_FOUND
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body('userId') userId: string
  ) {
    const serviceUrl = `${this.servicesURLs.comments}/posts/${postId}/comments/${commentId}`;
    const { data } = await this.httpService.axiosRef.delete(serviceUrl, { data: { userId } });

    return data;
  }

  // TODO: Likes
  // @Post('toggle-like')
  // @UseGuards(CheckAuthGuard)
  // @UseInterceptors(InjectUserIdInterceptor)
  // public async toggleLike() {}
}
