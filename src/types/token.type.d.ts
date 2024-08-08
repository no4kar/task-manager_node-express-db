import type * as Sequelize from 'sequelize';

export namespace TyToken {
  export type Item = {
    userId: string;
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
