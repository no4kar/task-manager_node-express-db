import mongoose from 'mongoose';

import { env } from '../configs/env.config.js';
// import modelName from 'src/models/modelName.js';
// import { userSchema } from 'src/models/mongoose/User.model.js';
// import { tokenSchema } from 'src/models/mongoose/Token.model.js';
// import { todoSchema } from 'src/models/mongoose/Todo.model.js';

export function connectDB() {
  return mongoose.connect(
    `mongodb+srv://${env.mangodb.user}:${env.mangodb.password}@cluster-node.2f56p.mongodb.net/task-manager?retryWrites=true&w=majority&appName=cluster-node`,
  );
}

export function createConnectionDB() {
  return mongoose.createConnection(
    `mongodb+srv://${env.mangodb.user}:${env.mangodb.password}@cluster-node.2f56p.mongodb.net/task-manager?retryWrites=true&w=majority&appName=cluster-node`,
  );

  // const conn = mongoose.createConnection(
  //   `mongodb+srv://${env.mangodb.user}:${env.mangodb.password}@cluster-node.2f56p.mongodb.net/task-manager?retryWrites=true&w=majority&appName=cluster-node`,
  // );

  // conn.model(modelName.user, userSchema);
  // conn.model(modelName.token, tokenSchema);
  // conn.model(modelName.todo, todoSchema);

  // return conn;
}
