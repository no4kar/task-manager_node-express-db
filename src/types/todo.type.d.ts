import type * as Sequelize from 'sequelize';

export declare namespace TyTodo {
  export {
    Item,
    ModelAttributes,
    CreationAttributes,
    Model,
    ModelStatic,
  }
}

type Item = {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
};

// ModelAttributes = Todo
type ModelAttributes = TyTodo.Item;
// CreationAttributes = Omit<Todo,'id'>; where the creation attributes differ from the model attributes, for example, when some fields are auto-generated (like id)
type CreationAttributes = Omit<TyTodo.Item, 'id'>;

type Model = Sequelize.Model<TyTodo.ModelAttributes, TyTodo.CreationAttributes>;
type ModelStatic = Sequelize.ModelStatic<Model>;
