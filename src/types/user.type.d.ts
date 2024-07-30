import type * as Sequelize from 'sequelize';

export namespace TyUser {
  export type Item = {
    id: string;
    email: string;
    password: string;
    activationToken: string;
    createdAt: string;
    updatedAt: string;
  };

  export type ItemPartial = Partial<Item>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;

  export type Model = Sequelize.Model<ModelAttributes, CreationAttributes>;
  export type ModelStatic = Sequelize.ModelStatic<Model>;
}
