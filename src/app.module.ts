import { Module } from '@nestjs/common';
import { DemoController } from './demo/demo.controller';
import { DemoService } from './demo/demo.service';
import { DemoModule } from './demo/demo.module';

@Module({
  controllers: [DemoController],
  providers: [DemoService],
  imports: [DemoModule],
})
export class AppModule {}
