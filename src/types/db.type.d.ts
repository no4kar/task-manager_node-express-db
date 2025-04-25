import type * as Mongoose from 'mongoose';
import type * as Sequelize from 'sequelize';

export namespace TyMongoose {
  export type Schema<DocType>
    = Mongoose.Schema<DocType>;
  export type Model<DocType>
    = Mongoose.Model<DocType>;
  export type Document<
    T = unknown,
    TQueryHelpers = any,
    DocType,
  > = Mongoose.Document<T, TQueryHelpers, DocType> & DocType & {
    _id: Mongoose.Types.ObjectId;
  };

  export namespace Query {
    export type Filter<DocType>
      = Mongoose.FilterQuery<DocType>;
  }
}

export namespace TySequelize {
  export type Model<
    ModelAttributes extends {} = any,
    CreationAttributes extends {} = ModelAttributes
  > = Sequelize.Model<ModelAttributes, CreationAttributes>;

  export type ModelStatic<Model>
    = Sequelize.ModelStatic<Model>;

  export namespace Query {
    export type FindOptions<T>
      = Sequelize.FindOptions<T>; // Model.findOne(FindOptions)

    export type WhereOptions<T>
      = Sequelize.WhereOptions<T>; // Model.findOne({where:WhereOptions})
  }
}