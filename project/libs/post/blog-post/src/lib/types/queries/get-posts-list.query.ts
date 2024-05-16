import { Expose, Transform } from 'class-transformer';
import { IsArray, IsIn, IsMongoId, IsNumber, IsOptional, IsString, Max } from 'class-validator';

import { PostTypeEnum, SortDirection, SortDirectionEnum, SortType, SortTypeEnum } from '@project/shared/core';

import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_TYPE,
  MAX_POSTS_PER_PAGE
} from '../../blog-post.constant';

export class GetPostsListQuery  {
  @Expose()
  @IsString()
  @IsOptional()
  public type?: PostTypeEnum;

  @Expose()
  @IsMongoId()
  @IsOptional()
  public authorId?: string;

  @Expose()
  @IsArray()
  @IsMongoId({ each: true })
  @IsString({ each: true })
  @IsOptional()
  public authorsIds?: string[];

  @Expose()
  @IsString()
  @IsOptional()
  public tag?: string;

  @Expose()
  @Transform(({ value }) => Number(value) || MAX_POSTS_PER_PAGE)
  @Max(MAX_POSTS_PER_PAGE)
  @IsNumber()
  @IsOptional()
  public limit?: number = MAX_POSTS_PER_PAGE;

  @Expose()
  @IsIn(Object.values(SortType))
  @IsOptional()
  public sortType?: SortTypeEnum = DEFAULT_SORT_TYPE;

  @Expose()
  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection?: SortDirectionEnum = DEFAULT_SORT_DIRECTION;

  @Expose()
  @Transform(({ value }) => Number(value) || DEFAULT_PAGE_NUMBER)
  @IsOptional()
  public page?: number = DEFAULT_PAGE_NUMBER;
}
