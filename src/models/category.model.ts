import { Optional } from 'sequelize';
import { Model, Table, Column, DataType, NotEmpty } from 'sequelize-typescript';

export interface CategoryAttributes {
  id: number;
  name: string;
}

export type CategoryCreationAttributes = Optional<CategoryAttributes, 'id'>;

@Table({
  timestamps: true,
  tableName: 'categories',
})
export default class Category extends Model<CategoryAttributes, CategoryCreationAttributes> {
  @NotEmpty
  @Column({
    type: DataType.STRING(255),
  })
  public name: string;
}
