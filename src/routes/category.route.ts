import { Router } from 'express';
import CategoryController from 'controllers/category.controller';
import CreateCategoryDto from 'dtos/category.dtos';
import Route from 'interfaces/routes.interface';
import validationMiddleware from 'middlewares/validation.middleware';
import authMiddleware from 'middlewares/auth.middleware';
import resourceExistenceMiddleware from '../middlewares/resource-existence.middleware';
import { ModelDefined } from 'sequelize';
import Category from '../models/category.model';

export default class CategoryRoute implements Route {
  public path = '/categories';
  public router = Router();
  public controller = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.makeRoute(''), authMiddleware, this.controller.list);

    this.router.post(
      this.makeRoute(''),
      authMiddleware,
      validationMiddleware(CreateCategoryDto, 'body'),
      this.controller.create,
    );

    this.router.get(
      this.makeRoute('/:id(\\d+)'),
      authMiddleware, // requires auth
      resourceExistenceMiddleware(Category as ModelDefined<any, any>),
      this.controller.getById,
    );

    this.router.patch(
      this.makeRoute('/:id(\\d+)'),
      authMiddleware, // requires auth
      resourceExistenceMiddleware(Category as ModelDefined<any, any>),
      validationMiddleware(CreateCategoryDto, 'body', true),
      this.controller.update,
    );

    this.router.delete(
      this.makeRoute('/:id(\\d+)'),
      authMiddleware, // requires auth
      this.controller.delete,
    );
  }

  public makeRoute(route: string) {
    return `${this.path}${route}`;
  }
}
