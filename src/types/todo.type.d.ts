import type * as Sequelize from 'sequelize';

export namespace TyTodo {
  export type Item = {
    id: string;
    userId: string;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  };

  export type ItemPartial = Partial<Item>;

  // ModelAttributes = Todo
  export type ModelAttributes = TyTodo.Item;
  // CreationAttributes = Omit<Todo,'id'>; where the creation attributes differ from the model attributes, for example, when some fields are auto-generated (like id)
  export type CreationAttributes = Omit<TyTodo.Item, 'id' | 'createdAt' | 'updatedAt'>;

  export type Model = Sequelize.Model<TyTodo.ModelAttributes, TyTodo.CreationAttributes>;
  export type ModelStatic = Sequelize.ModelStatic<Model>;
}
