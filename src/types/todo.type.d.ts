import type Sequelize from 'sequelize';
import type Mongoose from 'mongoose';

export namespace TyTodo {
  export type Item = {
    id: string;
    userId: string | Mongoose.Types.ObjectId;
    taskId: string | Mongoose.Types.ObjectId;
    title: string;
    completed: boolean;
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
