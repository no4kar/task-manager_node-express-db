export namespace TyTask {
  export type Item = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

  export type GetParams = Partial<Item>;
  export type UpdateParams = Pick<Item, 'id'>
  & Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>
  & Record<string, unknown>;
  export type Normalized = Pick<Item, 'id'>;
  export type Extended = Normalized & Record<string, unknown>;

  // export type ModelAttributes = Item;
  // export type CreationAttributes = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;

  // export type Model = Sequelize.Model<ModelAttributes, CreationAttributes>;
  // export type ModelStatic = Sequelize.ModelStatic<Model>;
}
