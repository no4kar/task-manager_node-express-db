import type * as Mongoose from 'mongoose';
import type * as Sequelize from 'sequelize';
import type * as MongoDB from 'mongodb';
import { TyToken } from './token.type.js';

export namespace TyMongoose {
  export type Schema<DocType>
    = Mongoose.Schema<DocType>;
  export type Model<DocType>
    = Mongoose.Model<DocType>;
  export type FoundDocument<T = unknown, TQueryHelpers = any, DocType>
    = Mongoose.Document<T, TQueryHelpers, DocType> & DocType & {
      _id: Mongoose.Types.ObjectId;
  };

  export namespace Query {
    export type Filter<DocType>
      = Mongoose.FilterQuery<DocType>;
  }
}

export namespace TySequelize {
  export type Model<ModelAttributes, CreationAttributes> = Sequelize.Model<ModelAttributes, CreationAttributes>;
  export type ModelStatic<Model> = Sequelize.ModelStatic<Model>;
}