import type Mongoose from 'mongoose';

export namespace TyTask {
  export type Item = {
    id: string | Mongoose.Types.ObjectId;
    userId: string | Mongoose.Types.ObjectId;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

  export type GetParams = Partial<Item>;
  export type UpdateParams =
    Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>
    & Record<string, unknown>;
  export type Normalized = Item;
  export type Extended = Normalized & Record<string, unknown>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;
}
