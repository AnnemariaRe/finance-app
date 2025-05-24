import { Controller, Get, Res, Post, Body, Req, Render } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Render('categories')
  async showCategories(@Req() req) {
    const userId = req.user.id;
    const categories = await this.categoriesService.findCategoriesByUserId(
      userId,
    );
    return { categories };
  }

  @Post('create')
  async createCategory(@Body() body: any, @Req() req: any, @Res() res) {
    const userId = req.user.id;
    await this.categoriesService.createCategory({
      name: body.name,
      operationType: body.operationType,
      userId,
    });
    res.redirect('/categories');
  }
}
