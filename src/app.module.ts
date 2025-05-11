import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DemoController } from './demo/demo.controller';
import { DemoService } from './demo/demo.service';
import { DemoModule } from './demo/demo.module';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';
import { ResponseTimeInterceptor } from './response-time.interceptor';

@Module({
  controllers: [DemoController],
  providers: [DemoService, {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTimeInterceptor}],
  imports: [UsersModule,
    TypeOrmModule.forRoot({
	  type: 'postgres',
      url: 'postgres://user:pg_password@db/postgres_db',
      entities: [User],
    })],
})
export class AppModule {}
