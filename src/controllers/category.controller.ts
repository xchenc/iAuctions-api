import { NextFunction, Request, Response } from 'express';
import Service from 'services/category.service';
import ListService from 'services/listings.service';
import Category from 'models/category.model';
import CreateCategoryDto from 'dtos/category.dtos';
import { RequestWithUser } from 'interfaces/auth.interface';
import { HttpException } from '../utils/util';
import Listing from '../models/listings.model';

class CategoryController {
  public service = new Service();
  private listService = new ListService();

  public list = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const findAll: Category[] = await this.service.list();
      res.status(200).json({ data: findAll, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data: CreateCategoryDto = req.body;

    try {
      const createOne = await this.service.create(data);
      res.status(201).json({ data: createOne, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    try {
      const data: Category = await this.service.findById(id);
      const listings: Listing[] = await this.listService.list(id);

      res.status(200).json({ data: { ...data.get(), listings }, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const data: CreateCategoryDto = req.body;

    try {
      const updateData: Category = await this.service.update(id, data);
      res.status(200).json({ data: updateData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    try {
      const data: Category = await this.service.findById(id);
      if (!data) {
        next(new HttpException(204, 'No Content'));
        return;
      }
      const deleteData: Category = await this.service.delete(id);
      res.status(200).json({ data: deleteData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CategoryController;
