import { Router } from 'express';
import ListingsController from 'controllers/listings.controller';
import CreateListingDto from 'dtos/listings.dtos';
import Route from 'interfaces/routes.interface';
import validationMiddleware from 'middlewares/validation.middleware';
import authMiddleware from 'middlewares/auth.middleware';

export default class ListingsRoute implements Route {
  public path = '/listings';
  public router = Router();
  public controller = new ListingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.makeRoute(''), authMiddleware, this.controller.list);

    this.router.post(
      this.makeRoute(''),
      authMiddleware,
      validationMiddleware(CreateListingDto, 'body'),
      this.controller.create,
    );
  }

  public makeRoute(route: string) {
    return `${this.path}${route}`;
  }
}
