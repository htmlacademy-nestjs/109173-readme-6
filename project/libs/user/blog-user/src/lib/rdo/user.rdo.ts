import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'
export class UserRDO {
  @ApiProperty({
    description: 'Uniq user ID',
    example: 'g83h4y0943-nv934819843-jv934h8t-n923g48n9438',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'iron-man@starkindustries.it'
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Tony'
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Stark'
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'User avatar',
    example: '/playboy/millioner/philanthropist.jpeg'
  })
  @Expose()
  avatar?: string;
}
