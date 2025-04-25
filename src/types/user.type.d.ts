export namespace TyUser {
  export type Item = {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };

  export type GetParams = Partial<Item>;
  export type UpdateParams =
    Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>;
  export type Normalized = Omit<Item, 'password' | 'createdAt' | 'updatedAt'>;
  export type Extended = Normalized & Record<string, unknown>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;
}
