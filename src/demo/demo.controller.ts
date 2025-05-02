import { Controller, Get, Render } from '@nestjs/common';
import { DemoService } from './demo.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get('hello')
  @Render('demo')
  getHello(): { message: string } {
    return { message: this.demoService.getHello() };
  }

  @Get('error')
  getError(): any {
    throw new Error('Method not implemented.');
  }
}
