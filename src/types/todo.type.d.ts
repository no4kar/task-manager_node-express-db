import type * as Sequelize from 'sequelize';
import type { Schema } from 'mongoose';

export namespace TyTodo {
  export type Item = {
    id: string;
    userId: string | Schema.Types.ObjectId;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  };

  export type ItemPartial = Partial<Item>;
  export type ItemNormalized = Pick<Item, 'id' | 'userId' | 'title' | 'completed' | 'createdAt' | 'updatedAt'>;
  export type ItemExtended = ItemNormalized & Record<string, unknown>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;

  export type Model = Sequelize.Model<ModelAttributes, CreationAttributes>;
  export type ModelStatic = Sequelize.ModelStatic<Model>;
}
