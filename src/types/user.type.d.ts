import type Sequelize from 'sequelize';
import type Mongoose from 'mongoose';

export namespace TyUser {
  export type Item = {
    id: string | Mongoose.Types.ObjectId;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  };

  export type GetParams = Partial<Item>;
  export type UpdateParams =
    Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>
    & Record<string, unknown>;
  export type Normalized = Pick<Item, 'id' | 'email'>;
  export type Extended = Normalized & Record<string, unknown>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;
}
