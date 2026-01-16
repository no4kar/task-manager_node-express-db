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
    /** Mongoose-friendly query filter */
    export type Filter<DocType>
      = Mongoose.FilterQuery<DocType>;

    /** Raw MongoDB driver filter */
    export type RawFilter<DocType>
      = Mongoose.mongo.Filter<DocType>;
  }

  export namespace Connection {
    export type Event =
      | 'connected'      // Emitted when successfully connected to MongoDB
      | 'open'           // Emitted once the connection is open (ready for operations)
      | 'reconnected'    // Emitted after a lost connection is successfully re-established
      | 'disconnecting'  // Emitted just before starting disconnection
      | 'disconnected'   // Emitted when fully disconnected from MongoDB
      | 'close'          // Emitted when the connection is closed
      | 'error'          // Emitted on connection or operational error
      | 'fullsetup'      // Emitted in replica sets when all nodes are connected
      | 'all'            // Emitted when all replica set members are connected
      | 'timeout';       // Emitted when the initial connection times out

    export type Listener
      = (...args: any[]) => void;
    export type Listeners
      = Partial<Record<Event, Listener>>;
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


export namespace TyDb {
  export type EntityKey =
    | 'USER'
    | 'TOKEN'
    | 'TODO'
    | 'TASK';

  export type IdentifiersMap = {
    [K in EntityKey]: Readonly<{
      model: string; // Sequelize model name (PascalCase)
      table: string; // Database table name (snake_case or lowercase plural)
    }>;
  };
}