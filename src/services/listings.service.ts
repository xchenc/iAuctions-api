import Listing from 'models/listings.model';
import CreateListingDto from 'dtos/listings.dtos';
import User from 'models/users.model';
import { HttpException, isEmpty } from '../utils/util';

class ListingService {
  public listings = Listing;

  public async list(categoryId = null): Promise<Listing[]> {
    const cond = categoryId
      ? {
          where: {
            categoryId: categoryId,
          },
        }
      : undefined;

    const listings: Listing[] = await this.listings.findAll(cond);
    return listings;
  }

  public async create(listingData: CreateListingDto, user: User): Promise<Listing> {
    const createdListing = await this.listings.create({ ...listingData, userId: user.id });
    return createdListing;
  }

  public async findById(id: number): Promise<Listing> {
    const doc: Listing = await this.listings.findByPk(id);
    return doc;
  }

  public async update(id: number, data: CreateListingDto): Promise<Listing> {
    if (isEmpty(data)) throw new HttpException(400, 'Empty payload');

    await this.listings.update(data, { where: { id: id } });

    const res: Listing = await this.listings.findByPk(id);
    return res;
  }

  public async delete(id: number): Promise<Listing> {
    if (isEmpty(id)) throw new HttpException(400, "Listing_id doesn't exist");

    const res: Listing = await this.listings.findByPk(id);
    if (!res) throw new HttpException(404, 'Not found');

    await this.listings.destroy({ where: { id: id } });

    return res;
  }
}

export default ListingService;
