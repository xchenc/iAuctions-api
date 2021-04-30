import Category from 'models/category.model';
import CreateCategoryDto from 'dtos/category.dtos';
import { HttpException, isEmpty } from '../utils/util';

class CategoryService {
  public categories = Category;

  public async list(): Promise<Category[]> {
    const categories: Category[] = await this.categories.findAll();
    return categories;
  }

  public async create(categoryData: CreateCategoryDto): Promise<Category> {
    const createdCategory = await this.categories.create({ ...categoryData });
    return createdCategory;
  }

  public async findById(id: number): Promise<Category> {
    const doc: Category = await this.categories.findByPk(id);
    return doc;
  }

  public async update(id: number, data: CreateCategoryDto): Promise<Category> {
    if (isEmpty(data)) throw new HttpException(400, 'Empty payload');

    await this.categories.update(data, { where: { id: id } });

    const res: Category = await this.categories.findByPk(id);
    return res;
  }

  public async delete(id: number): Promise<Category> {
    if (isEmpty(id)) throw new HttpException(400, "Category_id doesn't exist");

    const res: Category = await this.categories.findByPk(id);
    if (!res) throw new HttpException(404, 'Not found');

    await this.categories.destroy({ where: { id: id } });

    return res;
  }
}

export default CategoryService;
