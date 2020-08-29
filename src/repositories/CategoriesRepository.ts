import { EntityRepository, Repository } from "typeorm";
import Category from "../models/Category";

@EntityRepository(Category)
export default class CategoriesRepository extends Repository<Category>{
  public async findByTitleOrCreate(title: string): Promise<Category> {
    const category = await this.findOne({ where: { title } });

    if (category) return category;

    const newCategory = this.create({ title });

    await this.save(newCategory);

    return newCategory;
  }
}
