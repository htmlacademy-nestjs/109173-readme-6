import { Expose, Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  MinLength
} from 'class-validator';

import { PostTypeEnum, SortDirection, SortDirectionEnum, SortType, SortTypeEnum } from '@project/shared/core';

import {
  BlogPostValidation,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_TYPE,
  MAX_POSTS_PER_PAGE
} from '../../blog-post.constant';

export class BlogPostQuery {
  @Expose()
  @IsString()
  @IsOptional()
  public title?: string;

  @Expose()
  @IsString()
  @IsOptional()
  public type?: PostTypeEnum;

  @Expose()
  @IsBoolean()
  @IsOptional()
  public isPublished?: boolean;

  @Expose()
  @IsDateString()
  @IsOptional()
  public publishedAt?: Date;

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
  @MinLength(BlogPostValidation.TAG.MIN_LENGTH, { each: true })
  @MaxLength(BlogPostValidation.TAG.MAX_LENGTH, { each: true })
  @ArrayMaxSize(BlogPostValidation.TAG.MAX_СOUNT)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public tags?: string[];

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
