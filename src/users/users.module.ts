import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService,/*{
    provide: APP_GUARD,
    useClass: AuthGuard
  }*/],
  exports: [UsersService]
})
export class UsersModule {}
