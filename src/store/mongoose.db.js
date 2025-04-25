import mongoose from 'mongoose';

// import modelName from 'src/models/modelName.js';
// import { userSchema } from 'src/models/mongoose/User.model.js';
// import { tokenSchema } from 'src/models/mongoose/Token.model.js';
// import { todoSchema } from 'src/models/mongoose/Todo.model.js';

/** 
* @param {Object} param0 
* @param {string} param0.usernanme 
* @param {string} param0.password 
* @param {string} param0.collection 
* @returns */
export function connectDB({
  usernanme,
  password,
  collection,
}) {
  return mongoose.connect(
    `mongodb+srv://${usernanme}:${password}@cluster-node.2f56p.mongodb.net/${collection}?retryWrites=true&w=majority&appName=cluster-node`,
  );
}

/** 
* @param {Object} param0 
* @param {string} param0.usernanme 
* @param {string} param0.password 
* @param {string} param0.collection 
* @returns */
export function createConnectionDB({
  usernanme,
  password,
  collection,
}) {
  return mongoose.createConnection(
    `mongodb+srv://${usernanme}:${password}@cluster-node.2f56p.mongodb.net/${collection}?retryWrites=true&w=majority&appName=cluster-node`,
  );

  // const conn = mongoose.createConnection(
  //   `mongodb+srv://${env.mangodb.user}:${env.mangodb.password}@cluster-node.2f56p.mongodb.net/task-manager?retryWrites=true&w=majority&appName=cluster-node`,
  // );

  // conn.model(modelName.user, userSchema);
  // conn.model(modelName.token, tokenSchema);
  // conn.model(modelName.todo, todoSchema);

  // return conn;
}
