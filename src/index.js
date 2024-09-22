'use strict';
// @ts-check

import * as todosServer from './todosServer.js';
import { env } from './configs/env.config.js';
import { connectDB } from './store/mongoose.db.js';

/**
 * @param {string} serverName
 * @param {Object} configs */
function serverRunInfo(serverName, configs) {
  return (`
${serverName} is running 
server: ${configs.server.host}
client: ${configs.client.host}
`);
};

try {
  const start = Date.now();

  await connectDB();
  console.info(`Connected to MongoDB in ${Date.now() - start} ms`);

  todosServer.app.listen(env.todo.server.port, () => {
    console.info(serverRunInfo('todosServer', env.todo));
  });

} catch (error) {
  console.dir(error);
  process.exit(1);
}
