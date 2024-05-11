import { Module } from '@nestjs/common';
import { BlogUserModule } from '@project/user/blog-user';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { BCryptHasher } from '@project/shared/hasher'

import { ConfigService } from '@nestjs/config';

import { UserNotifyModule } from '@project/user/user-notify';

import { JwtModule } from '@nestjs/jwt';
import { getJWTOptions } from '@project/shared/configurations/jwt-config';
import { JWTAccessStrategy } from './strategies/jwt-access.strategy';
@Module({
  imports: [
    // Модуль для работы с JWT-токенами
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJWTOptions,
    }),

    // Модуль для работы с уведомлениями
    UserNotifyModule,

    // Импортируем модуль управления пользователями блога
    // для дальнейшей возможности пользоваться его провайдерами
    BlogUserModule
  ],
  controllers: [AuthenticationController],
  providers: [
    JWTAccessStrategy,
    AuthenticationService,
    {
      provide: 'Hasher',
      useClass: BCryptHasher
    }
  ]
})
export class AuthenticationModule {}
