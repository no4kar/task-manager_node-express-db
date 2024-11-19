import type Sequelize from 'sequelize';
import type Mongoose from 'mongoose';

export namespace TyToken {
  export type Item = {
    userId: string | Mongoose.Types.ObjectId;
    refresh: string | null;
    activation: string | null;
    createdAt: string;
    updatedAt: string;
  };

  export type GetParams = Partial<Item>;
  export type UpdateParams =
    Partial<Omit<Item, 'userId' | 'createdAt' | 'updatedAt'>>
    & Record<string, unknown>;
  export type Normalized = Pick<Item, 'userId' | 'refresh' | 'activation'>;
  export type Extended = Normalized & Record<string, unknown>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'createdAt' | 'updatedAt'>;
}
