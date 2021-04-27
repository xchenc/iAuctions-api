import Bid from '../models/bids.model';
import CreateBidDto from '../dtos/bids.dtos';
import User from '../models/users.model';

class BidsService {
  public model = Bid;

  public async list(listingId = null): Promise<Bid[]> {
    const cond = listingId
      ? {
          where: {
            listingId: listingId,
          },
        }
      : undefined;

    const data: Bid[] = await this.model.findAll(cond);
    return data;
  }

  public async create(data: CreateBidDto, user: User, listingId: number): Promise<Bid> {
    return await this.model.create({ ...data, userId: user.id, listingId: listingId });
  }
}

export default BidsService;
