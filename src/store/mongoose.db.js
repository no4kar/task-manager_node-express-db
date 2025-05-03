'use strict';
// @ts-check

/**
 * @typedef {import('src/types/db.type').TyMongoose.Connection.Listeners} TyListeners
*/

import mongoose from 'mongoose';

/** 
* @param {Object} param0 
* @param {string} param0.usernanme 
* @param {string} param0.password 
* @param {string} param0.collection 
* @param {TyListeners} param0.on 
* @returns */
export function connectDB({
  usernanme,
  password,
  collection,
  on,
}) {
  // Apply all event listeners dynamically
  for (const [event, listener] of Object.entries(on)) {
    mongoose.connection.on(event, listener);
  }

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
