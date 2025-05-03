'use strict';
// @ts-check

/**
 * @typedef {import('src/types/db.type').TyMongoose.Connection.Listeners} TyListeners
*/

import * as todosServer from './todosServer.js';
import { env } from './configs/env.config.js';
import { connectDB } from './store/mongoose.db.js';
import { Timer } from './utils/timer.js';

/**
 * @param {string} serverName
 * @param {typeof env.todo} configs */
function serverRunInfo(serverName, configs) {
  return (`
${serverName} is running
server: ${configs.server.host}
client: ${configs.client.host}
`);
};

try {

  if (env.orm.solution === 'mongoose') {
    const dbTimer = new Timer();

    const on
      = /**@type {TyListeners}*/({
        connected:
          () => console.log('connected'
            + `\n\tin ${dbTimer.now()} ms`),
        open:
          () => {
            console.info('open'
              + `\n\tin ${dbTimer.now()} ms`);
          },
        reconnected:
          () => {
            console.log('reconnected'
              + `\n\tin ${dbTimer.stop().duration()} ms`);
            dbTimer.start();
          },
        disconnecting:
          () => console.log('disconnecting'
            + `\n\tin ${dbTimer.now()} ms`),
        disconnected:
          () => console.log('disconnected'),
        close:
          () => console.log('close'
            + `\n\tin ${dbTimer.stop().duration()} ms`),
      });
    
    dbTimer.start();
    await connectDB({
      usernanme: env.mangodb.user,
      password: env.mangodb.password,
      collection: 'task-manager',
      on,
    });
  }

  todosServer.app.listen(env.todo.server.port, () => {
    console.info(serverRunInfo('todosServer', env.todo));
  });

} catch (error) {
  console.dir(error);
  process.exit(1);
}
