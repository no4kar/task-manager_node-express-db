import type * as Mongoose from 'mongoose';
import type * as MongoDB from 'mongodb';
import { TyToken } from './token.type.js';

export namespace TyMongoose {
  export type Schema<DocType>
    = Mongoose.Schema<DocType>;
  export type Model<DocType>
    = Mongoose.Model<DocType>;

  export namespace Query {
    export type Filter<DocType>
      = Mongoose.FilterQuery<DocType>;
  }
}
