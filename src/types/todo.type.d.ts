import type {
  TyGeneral
} from '#types/general.type.d.ts'

export namespace TyTodo {
  export type Item = {
    id: string;
    userId: string;
    taskId: string;
    title: string;
    images?: Array<TyGeneral.Image>;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

  export type GetParams = Partial<Item>;
  export type UpdateParams =
    Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>;
  export type Normalized = Item;
  export type Extended = Normalized & Record<string, unknown>;

  export type ModelAttributes = Item;
  export type CreationAttributes = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;
}
