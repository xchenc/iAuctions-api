import { NextFunction, Request, Response } from 'express';
import Service from 'services/listings.service';
import Listing from 'models/listings.model';
import CreateListingDto from 'dtos/listings.dtos';
import { RequestWithUser } from 'interfaces/auth.interface';
import { HttpException } from '../utils/util';
import CreateCommentDto from '../dtos/comments.dtos';
import CommentService from 'services/comment.service';
import Comment from '../models/comments.model';
import BidsService from '../services/bids.service';
import CreateBidDto from '../dtos/bids.dtos';
import Bid from '../models/bids.model';

class ListingsController {
  public service = new Service();
  public commentService = new CommentService();
  public bidsService = new BidsService();

  public list = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const findAll: Listing[] = await this.service.list();
      res.status(200).json({ data: findAll, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data: CreateListingDto = req.body;

    try {
      const createOne = await this.service.create(data, req.user);
      res.status(201).json({ data: createOne, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    try {
      const data: Listing = await this.service.findById(id);
      const comments: Comment[] = await this.commentService.list(id);
      const bids: Bid[] = await this.bidsService.list(id);

      res.status(200).json({ data: { ...data.get(), comments, bids }, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const data: CreateListingDto = req.body;

    try {
      const findList = await this.service.findById(id);
      if (req.user.id !== findList.userId) {
        next(new HttpException(403, 'Not allowed'));
        return;
      }

      const updateData: Listing = await this.service.update(id, data);
      res.status(200).json({ data: updateData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    try {
      const data: Listing = await this.service.findById(id);
      if (!data) {
        next(new HttpException(204, 'No Content'));
        return;
      }

      const findList = await this.service.findById(id);
      if (req.user.id !== findList.userId) {
        next(new HttpException(403, 'Not allowed'));
        return;
      }

      const deleteData: Listing = await this.service.delete(id);
      res.status(200).json({ data: deleteData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public createComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data: CreateCommentDto = req.body;
    const id = Number(req.params.id);
    try {
      await this.commentService.create(data, req.user, id);
      await this.getById(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  public createBid = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data: CreateBidDto = req.body;
    const id = Number(req.params.id);
    try {
      const listing: Listing = await this.service.findById(id);
      if (data.amount <= listing.price) {
        next(new HttpException(403, "bid amount can't less than or equal to the listing price"));
        return;
      }

      await this.bidsService.create(data, req.user, id);
      await this.service.update(id, {
        ...listing.get(),
        price: data.amount,
      });

      await this.getById(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default ListingsController;
