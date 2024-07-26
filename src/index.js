'use strict';
// @ts-check

import * as todosServer from './todosServer.js';
import { todos as todosConfig } from './config.js';

/**
 * @param {string} serverName
 * @param {number} port
 * @param {string} clientUrl
 */
function serverRunInfo(serverName, port, clientUrl) {
  return (`
${serverName} is running on PORT=${port}
origin: ${clientUrl}
`);
};

todosServer.app.listen(todosConfig.server.port, () => {
  console.info(serverRunInfo('todosServer', Number(todosConfig.server.port), 'localhost'));
});
