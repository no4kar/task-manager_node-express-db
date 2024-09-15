import type * as Sequelize from 'sequelize';

export namespace TyUser {
  export type Item = {
    id: string;
    email: string;
    password: string;
    activationToken: string | null;
    createdAt: string;
    updatedAt: string;
  };

  export type ItemPartial = Partial<Item>;
  export type ItemNormalized = Pick<Item, 'id' | 'email'>;
  export type ItemExtended = ItemNormalized & Record<string, unknown>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;

  export type Model = Sequelize.Model<ModelAttributes, CreationAttributes>;
  export type ModelStatic = Sequelize.ModelStatic<Model>;
}
