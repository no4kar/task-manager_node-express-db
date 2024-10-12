import type * as Sequelize from 'sequelize';
import type { Schema } from 'mongoose';

export namespace TyToken {
  export type Item = {
    userId: string | Schema.Types.ObjectId;
    refreshToken: string;
    createdAt: string;
    updatedAt: string;
  };

  export type GetParams = Partial<Item>;
  export type UpdateParams = Pick<Item, 'userId'>
  & Partial<Omit<Item, 'createdAt' | 'updatedAt'>>
  & Record<string, unknown>;
  export type Normalized = Pick<Item, 'userId' | 'refreshToken'>;
  export type Extended = Normalized & Record<string, unknown>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'createdAt' | 'updatedAt'>;

  export type Model = Sequelize.Model<ModelAttributes, CreationAttributes>;
  export type ModelStatic = Sequelize.ModelStatic<Model>;
}
