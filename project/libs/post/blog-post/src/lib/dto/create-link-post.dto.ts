import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { BlogPostValidation } from '../blog-post.constant';
export class CreateLinkPostDTO {
  @ApiProperty({
    description: 'Valid link URL',
    example: 'https://up.htmlacademy.ru/profession/fullstack/6/nodejs-2/6/project/readme',
    required: true
  })
  @IsUrl()
  @IsNotEmpty()
  public linkURL: string;

  @ApiProperty({
    description: 'Link description',
    example: 'Site to check your internet connection speed',
    maxLength: BlogPostValidation.LINK_DESCRIPTION.MAX_LENGTH
  })
  @MaxLength(BlogPostValidation.LINK_DESCRIPTION.MAX_LENGTH)
  @IsString()
  @IsOptional()
  public description: string;
}
