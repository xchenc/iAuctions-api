import { Router } from 'express';
import ListingsController from 'controllers/listings.controller';
import CreateListingDto from 'dtos/listings.dtos';
import Route from 'interfaces/routes.interface';
import validationMiddleware from 'middlewares/validation.middleware';
import authMiddleware from 'middlewares/auth.middleware';
import resourceExistenceMiddleware from '../middlewares/resource-existence.middleware';
import { ModelDefined } from 'sequelize';
import Listing from '../models/listings.model';
import CreateCommentDto from '../dtos/comments.dtos';
import CreateBidDto from '../dtos/bids.dtos';

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

    this.router.get(
      this.makeRoute('/:id(\\d+)'),
      authMiddleware, // requires auth
      resourceExistenceMiddleware(Listing as ModelDefined<any, any>),
      this.controller.getById,
    );

    this.router.patch(
      this.makeRoute('/:id(\\d+)'),
      authMiddleware, // requires auth
      resourceExistenceMiddleware(Listing as ModelDefined<any, any>),
      validationMiddleware(CreateListingDto, 'body', true),
      this.controller.update,
    );

    this.router.delete(
      this.makeRoute('/:id(\\d+)'),
      authMiddleware, // requires auth
      this.controller.delete,
    );

    this.router.post(
      this.makeRoute('/:id(\\d+)/comments'),
      authMiddleware,
      validationMiddleware(CreateCommentDto, 'body'),
      this.controller.createComment,
    );

    this.router.post(
      this.makeRoute('/:id(\\d+)/bids'),
      authMiddleware,
      validationMiddleware(CreateBidDto, 'body'),
      this.controller.createBid,
    );
  }

  public makeRoute(route: string) {
    return `${this.path}${route}`;
  }
}
