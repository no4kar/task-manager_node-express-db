'use strict';
// @ts-check

/**
 * @typedef {import('#src/types/db.type.js')
 * .TyMongoose.Connection.Listeners
 * } TyListeners
*/

import * as todosServer from '#src/todosServer.js';
import { env } from '#src/configs/env.config.js';
import { connectDB } from '#src/store/mongoose.db.js';
import { Timer } from '#src/utils/timer.js';
import { logger } from '#src/utils/logger.js';

/**
 * @param {string} serverName
 * @param {typeof env.project} configs */
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
          () => logger.info('connected'
            + `\n\tin ${dbTimer.now()} ms`),
        open:
          () => {
            logger.info('open'
              + `\n\tin ${dbTimer.now()} ms`);
          },
        reconnected:
          () => {
            logger.info('reconnected'
              + `\n\tin ${dbTimer.stop().duration()} ms`);
            dbTimer.start();
          },
        disconnecting:
          () => logger.info('disconnecting'
            + `\n\tin ${dbTimer.now()} ms`),
        disconnected:
          () => logger.info('disconnected'),
        close:
          () => logger.info('close'
            + `\n\tin ${dbTimer.stop().duration()} ms`),
      });

    dbTimer.start();
    const connected =
      await connectDB({
        username: env.mangodb.user,
        password: env.mangodb.password,
        database: 'task-manager',
        on,
      });

    connected.connection.db;
  }

  todosServer.app.listen(
    env.project.server.port,
    () => {
      logger.info(serverRunInfo(
        'todosServer',
        env.project));
    });

} catch (error) {
  logger.dir(error);
  process.exit(1);
}
