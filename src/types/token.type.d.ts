export namespace TyToken {
  export type Item = {
    userId: string;
    refresh: string | null;
    activation: string | null;
    createdAt: Date;
    updatedAt: Date;
  };

  export type GetParams = Partial<Item>;
  export type UpdateParams =
    Partial<Omit<Item, 'userId' | 'createdAt' | 'updatedAt'>>;
  export type Normalized = Item;
  export type Extended = Normalized & Record<string, unknown>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'createdAt' | 'updatedAt'>;
}
