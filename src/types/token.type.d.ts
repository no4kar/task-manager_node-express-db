import type * as Sequelize from 'sequelize';
import type { Schema } from 'mongoose';

export namespace TyToken {
  export type Item = {
    userId: string | Schema.Types.ObjectId;
    refreshToken: string;
    createdAt: string;
    updatedAt: string;
  };

  export type ItemPartial = Partial<Item>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'createdAt' | 'updatedAt'>;

  export type Model = Sequelize.Model<ModelAttributes, CreationAttributes>;
  export type ModelStatic = Sequelize.ModelStatic<Model>;
}
