import type {
  QueryWithHelpers,
  HydratedDocument,
  Query,
} from 'mongoose';
import type {
  DeleteResult,
} from 'mongodb';

export namespace TyMongoose {
  export namespace Query {
    export type Arr<DocType>
      = QueryWithHelpers<HydratedDocument<DocType[]>, DocType>;
    export type Item<DocType>
      = QueryWithHelpers<HydratedDocument<DocType>, DocType>;
    export type DeleteOne<DocType>
      = Query<DeleteResult, Item<DocType>>;
  }
}
