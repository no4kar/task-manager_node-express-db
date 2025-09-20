'use strict';
// @ts-check

import mongoose from 'mongoose';

/**
 * @typedef {import('src/types/db.type.js')
 * .TyMongoose.Connection.Listeners
 * } TyListeners
*/

/** 
* @param {Object} param0 
* @param {string} param0.username 
* @param {string} param0.password 
* @param {string} param0.database 
* @param {string} [param0.host]
* @param {string} [param0.appName]
* @param {TyListeners} [param0.on] 
* @returns */
export function connectDB({
  username,
  password,
  database,
  host = 'cluster-node.2f56p.mongodb.net',
  appName = 'cluster-node',
  on = {},
}) {
  // Apply all event listeners dynamically
  for (const [event, listener] of Object.entries(on)) {
    mongoose.connection.on(event, listener);
  }

  const uri
    = `mongodb+srv://${encodeURIComponent(username)}`
    + `:${encodeURIComponent(password)}`
    + `@${encodeURIComponent(host)}`
    + `/${encodeURIComponent(database)}?retryWrites=true&w=majority`
    + `&appName=${encodeURIComponent(appName)}`;

  mongoose.set('strictQuery', true);

  return mongoose.connect(
    uri, {
    autoIndex: false,
    serverSelectionTimeoutMS: 15000,
  });
}

/** 
* @param {Object} param0 
* @param {string} param0.usernanme 
* @param {string} param0.password 
* @param {string} param0.database 
* @returns */
export function createConnectionDB({
  usernanme,
  password,
  database,
}) {
  return mongoose.createConnection(
    `mongodb+srv://${usernanme}:${password}@cluster-node.2f56p.mongodb.net/${database}?retryWrites=true&w=majority&appName=cluster-node`,
  );

  // const conn = mongoose.createConnection(
  //   `mongodb+srv://${env.mangodb.user}:${env.mangodb.password}@cluster-node.2f56p.mongodb.net/task-manager?retryWrites=true&w=majority&appName=cluster-node`,
  // );

  // conn.model(modelName.user, userSchema);
  // conn.model(modelName.token, tokenSchema);
  // conn.model(modelName.todo, todoSchema);

  // return conn;
}
